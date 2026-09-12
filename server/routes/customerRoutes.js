const express = require('express');
const { protect } = require('../middleware/auth'); // assuming auth middleware provides protect
const { getCustomerDashboard, getCustomerProfile } = require('../controllers/customerController');

const router = express.Router();

// Protect all routes
router.use(protect);

// GET /api/customer/dashboard
router.get('/dashboard', getCustomerDashboard);

// GET /api/customer/profile
router.get('/profile', getCustomerProfile);

module.exports = router;
