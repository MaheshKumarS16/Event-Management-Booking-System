const express = require('express');
const {
  getAdminDashboardStats,
  getUsers,
  updateUserStatus
} = require('../controllers/adminController');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Admin REST API Routes
 * 
 * Concept Explanation:
 * - What it is: Protected router for administrator actions including analytics, user management, and event approval.
 * - Why we need it: Powers the Admin Dashboard with secured role-restricted endpoints.
 * - Where we use it: Mounted at /api/admin in server.js.
 */

// All routes require authenticated Admin
router.use(authenticateUser, authorizeRole('admin'));

// GET /api/admin/dashboard - Platform-wide statistics
router.get('/dashboard', getAdminDashboardStats);

// GET /api/admin/users - User listing with search & filter
router.get('/users', getUsers);

// PUT /api/admin/users/:id/status - Block or unblock a user
router.put('/users/:id/status', updateUserStatus);

module.exports = router;
