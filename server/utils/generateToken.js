const jwt = require('jsonwebtoken');

/**
 * Generate JSON Web Token (JWT) Helper
 * 
 * Concept Explanation:
 * - What it is: A digital signature generator that packages user ID and role into a cryptographically signed string.
 * - Why we need it: Enables stateless authentication across HTTP requests without needing session storage on the server.
 * - Where we use it: Called during user registration and login in authController.js.
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET || 'eventify_super_secret_jwt_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;
