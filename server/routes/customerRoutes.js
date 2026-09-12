const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware'); // corrected import
const { getCustomerDashboard, getCustomerProfile } = require('../controllers/customerController');

const router = express.Router();

// Protect all routes
router.use(authenticateUser); // protect routes with authentication

// GET /api/customer/dashboard
router.get('/dashboard', getCustomerDashboard);

// GET /api/customer/profile
router.get('/profile', getCustomerProfile);

module.exports = router;
