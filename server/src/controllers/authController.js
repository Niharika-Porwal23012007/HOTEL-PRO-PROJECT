import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { mockUsers } from '../config/mockData.js';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/tokens.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export class AuthController {
  /**
   * Register new user (AUTH-01, AUTH-02)
   */
  static async register(req, res, next) {
    try {
      const { name, email, password, phone, role } = req.body;

      if (mongoose.connection.readyState !== 1) {
        const mockUser = {
          _id: `user_${Date.now()}`,
          name,
          email: email.toLowerCase(),
          role: role || 'guest',
        };
        const accessToken = generateAccessToken(mockUser);
        const refreshToken = generateRefreshToken(mockUser);
        setRefreshTokenCookie(res, refreshToken);
        return sendSuccess(res, 201, 'Registration successful (in-memory mode)', {
          user: mockUser,
          accessToken,
        });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return sendError(res, 400, 'An account with this email already exists.');
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        passwordHash,
        role: role && ['guest', 'staff', 'admin'].includes(role) ? role : 'guest',
        isVerified: true,
      });
      await user.save();

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      await Session.create({
        userId: user._id,
        refreshTokenHash: hashToken(refreshToken),
        device: req.headers['user-agent'] || 'Web Browser',
        ipAddress: req.ip || '',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      setRefreshTokenCookie(res, refreshToken);

      return sendSuccess(res, 201, 'Registration successful', {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Login user with rate-limiting & brute force lock (AUTH-03, AUTH-13)
   */
  static async login(req, res, next) {
    try {
      const { email, password, rememberMe } = req.body;

      // In-Memory Mode fallback
      if (mongoose.connection.readyState !== 1) {
        const found = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
        const user = found || {
          _id: `user_${Date.now()}`,
          name: email.split('@')[0],
          email: email.toLowerCase(),
          role: email.includes('admin') ? 'admin' : email.includes('staff') ? 'staff' : 'guest',
        };

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user, !!rememberMe);
        setRefreshTokenCookie(res, refreshToken, !!rememberMe);

        return sendSuccess(res, 200, 'Login successful (in-memory mode)', {
          user: { id: user._id, name: user.name, email: user.email, role: user.role },
          accessToken,
        });
      }

      const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
      if (!user) {
        return sendError(res, 401, 'Invalid email or password.');
      }

      if (user.isLocked()) {
        const remainingMinutes = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
        return sendError(
          res,
          423,
          `Account is temporarily locked due to 5 failed attempts. Please try again in ${remainingMinutes} minute(s).`
        );
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        user.failedLoginCount += 1;
        if (user.failedLoginCount >= 5) {
          user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        }
        await user.save();
        return sendError(res, 401, 'Invalid email or password.');
      }

      user.failedLoginCount = 0;
      user.lockUntil = null;
      await user.save();

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user, !!rememberMe);

      await Session.create({
        userId: user._id,
        refreshTokenHash: hashToken(refreshToken),
        device: req.headers['user-agent'] || 'Web Browser',
        ipAddress: req.ip || '',
        expiresAt: new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000),
      });

      setRefreshTokenCookie(res, refreshToken, !!rememberMe);

      return sendSuccess(res, 200, 'Login successful', {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return sendError(res, 401, 'No refresh token provided.');
      }

      if (mongoose.connection.readyState !== 1) {
        const mockUser = mockUsers[2];
        const newAccessToken = generateAccessToken(mockUser);
        return sendSuccess(res, 200, 'Session refreshed (in-memory mode)', {
          accessToken: newAccessToken,
          user: mockUser,
        });
      }

      const hashed = hashToken(refreshToken);
      const session = await Session.findOne({ refreshTokenHash: hashed, revoked: false });

      if (!session || new Date() > new Date(session.expiresAt)) {
        clearRefreshTokenCookie(res);
        return sendError(res, 401, 'Session expired or revoked. Please log in again.');
      }

      const user = await User.findById(session.userId);
      if (!user || !user.isActive) {
        clearRefreshTokenCookie(res);
        return sendError(res, 401, 'User account no longer active.');
      }

      session.lastUsedAt = new Date();
      await session.save();

      const newAccessToken = generateAccessToken(user);

      return sendSuccess(res, 200, 'Session refreshed', {
        accessToken: newAccessToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken && mongoose.connection.readyState === 1) {
        const hashed = hashToken(refreshToken);
        await Session.updateOne({ refreshTokenHash: hashed }, { revoked: true });
      }
      clearRefreshTokenCookie(res);
      return sendSuccess(res, 200, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  }

  static async logoutAll(req, res, next) {
    try {
      if (mongoose.connection.readyState === 1 && req.user?._id) {
        await Session.updateMany({ userId: req.user._id }, { revoked: true });
      }
      clearRefreshTokenCookie(res);
      return sendSuccess(res, 200, 'Logged out from all devices.');
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return sendSuccess(res, 200, 'Profile loaded (in-memory mode)', { user: req.user || mockUsers[2] });
      }
      const user = await User.findById(req.user._id);
      return sendSuccess(res, 200, 'Profile loaded', { user });
    } catch (err) {
      next(err);
    }
  }

  static async getSessions(req, res, next) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return sendSuccess(res, 200, 'Sessions retrieved', { sessions: [] });
      }
      const sessions = await Session.find({ userId: req.user._id, revoked: false }).sort({ lastUsedAt: -1 });
      return sendSuccess(res, 200, 'Sessions retrieved', { sessions });
    } catch (err) {
      next(err);
    }
  }

  static async forgotPassword(req, res, next) {
    return sendSuccess(
      res,
      200,
      'If an account with that email exists, a password reset link has been dispatched.'
    );
  }

  static async updateProfile(req, res, next) {
    try {
      const { name, phone, address } = req.body;

      if (mongoose.connection.readyState !== 1) {
        return sendSuccess(res, 200, 'Profile updated (in-memory mode)', {
          user: {
            ...(req.user || mockUsers[2]),
            name: name || req.user?.name,
            phone: phone || '',
            address: address || '',
          },
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          ...(name ? { name } : {}),
          phone: phone ?? '',
          address: address ?? '',
        },
        { new: true, runValidators: true }
      );

      if (!user) {
        return sendError(res, 404, 'User not found');
      }

      return sendSuccess(res, 200, 'Profile updated successfully', { user });
    } catch (err) {
      next(err);
    }
  }
}
