import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_123',
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
  );
};

export const generateRefreshToken = (user, rememberMe = false) => {
  const expiresIn = rememberMe ? '30d' : (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d');
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_456',
    { expiresIn }
  );
};

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const setRefreshTokenCookie = (res, token, rememberMe = false) => {
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge,
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
};
