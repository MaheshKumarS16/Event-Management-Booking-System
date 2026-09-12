const express = require('express');
const { register, login, getMe, logout } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidators');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Authentication REST API Routes
 * 
 * Concept Explanation:
 * - What it is: Express Router mapping HTTP request methods and URLs to authentication controller functions.
 * - Why we need it: Exposes clean REST API endpoints for frontend registration, login, and session checks.
 * - Where we use it: Mounted at /api/auth in server.js.
 */

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticateUser, getMe);
router.post('/logout', logout);

module.exports = router;
