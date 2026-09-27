const express = require('express');
const {
  updateProfile,
  changePassword
} = require('../controllers/userController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * User Profile REST API Routes
 * 
 * Concept Explanation:
 * - What it is: Protected router for authenticated users to update their profile and change password.
 * - Why we need it: Allows customers, organizers, and admins to manage their account details.
 * - Where we use it: Mounted at /api/users in server.js.
 */

// All routes require authenticated user
router.use(authenticateUser);

// PUT /api/users/profile - Update name and phone
router.put('/profile', updateProfile);

// PUT /api/users/change-password - Change account password
router.put('/change-password', changePassword);

module.exports = router;
