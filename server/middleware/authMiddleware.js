const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware: Verify JWT Token
 * 
 * Concept Explanation:
 * - What it is: A security filter that inspects incoming HTTP request headers for a valid JWT token.
 * - Why we need it: Protects API endpoints from unauthenticated or malicious requests.
 * - Where we use it: Applied to all private/protected Express routes.
 */
const authenticateUser = async (req, res, next) => {
  let token;

  // Check for Authorization header starting with 'Bearer '
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  try {
    // Verify JWT token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'eventify_super_secret_jwt_key_2026');

    // Fetch user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User no longer exists.'
      });
    }

    // Check if user account is blocked by Admin
    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by an Administrator.'
      });
    }

    // Attach user payload to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

/**
 * Authorization Middleware: Role-based Permission Control
 * 
 * Concept Explanation:
 * - What it is: A secondary check verifying if the authenticated user has the necessary role (customer, organizer, admin).
 * - Why we need it: Prevents customers from accessing organizer/admin routes or organizers from viewing admin features.
 * - Where we use it: Placed after authenticateUser on role-restricted endpoints.
 */
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role: ${allowedRoles.join(' or ')}.`
      });
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizeRole
};
