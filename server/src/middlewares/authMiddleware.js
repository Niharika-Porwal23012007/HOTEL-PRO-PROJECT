import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { sendError } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 401, 'Authentication required. Please log in.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_123');

    if (mongoose.connection.readyState !== 1) {
      req.user = {
        _id: decoded.id,
        name: decoded.name || 'Guest User',
        email: decoded.email || 'guest@hotelpro.com',
        role: decoded.role || 'guest',
        isActive: true,
      };
      return next();
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, 401, 'User associated with this token no longer exists.');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Your account has been deactivated. Please contact support.');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expired. Please refresh your session.', { expired: true });
    }
    return sendError(res, 401, 'Invalid authentication token.');
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_123');
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    } catch {
      // Ignored for optional auth
    }
  }
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Not authenticated');
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, `Access denied. Role '${req.user.role}' is not authorized to access this resource.`);
    }
    next();
  };
};
