import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper function to sign a JWT token
export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production',
    {
      expiresIn: '30d',
    }
  );
};

// Middleware to verify JWT and authenticate user
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production'
      );

      // Attach user object to request, excluding password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists',
        });
      }

      return next();
    } catch (error) {
      console.error('[Auth Middleware] Token error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

// Middleware to restrict access to Admins only
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Admin privileges required',
  });
};
