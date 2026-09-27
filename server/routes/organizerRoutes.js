const express = require('express');
const {
  getOrganizerDashboardStats,
  getOrganizerAttendees
} = require('../controllers/organizerController');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Organizer REST API Routes
 * 
 * Concept Explanation:
 * - What it is: Protected router for event organizers to access analytics and attendee lists.
 * - Why we need it: Powers the Organizer Dashboard metrics and attendee tables.
 * - Where we use it: Mounted at /api/organizer in server.js.
 */

// All routes require authenticated Organizer or Admin
router.use(authenticateUser, authorizeRole('organizer', 'admin'));

// GET /api/organizer/dashboard - Organizer analytics & revenue metrics
router.get('/dashboard', getOrganizerDashboardStats);

// GET /api/organizer/attendees - Attendee roster across organizer's events
router.get('/attendees', getOrganizerAttendees);

module.exports = router;
