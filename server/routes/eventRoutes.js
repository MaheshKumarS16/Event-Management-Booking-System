const express = require('express');
const {
  getEvents,
  getEventById,
  getOrganizerEvents,
  createEvent,
  updateEvent,
  updateEventStatus,
  deleteEvent
} = require('../controllers/eventController');
const { eventValidation } = require('../validators/eventValidators');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Event REST API Routes
 * 
 * Concept Explanation:
 * - What it is: Express router mapping endpoints for event management, discovery, and approval.
 * - Why we need it: Exposes REST API routes for browsing published events and managing organizer events.
 * - Where we use it: Mounted at /api/events in server.js.
 */

router.get('/', getEvents);
router.get('/my-events', authenticateUser, authorizeRole('organizer', 'admin'), getOrganizerEvents);
router.get('/:id', getEventById);
router.post('/', authenticateUser, authorizeRole('organizer', 'admin'), eventValidation, createEvent);
router.put('/:id', authenticateUser, authorizeRole('organizer', 'admin'), updateEvent);
router.put('/:id/status', authenticateUser, authorizeRole('admin'), updateEventStatus);
router.delete('/:id', authenticateUser, authorizeRole('organizer', 'admin'), deleteEvent);

module.exports = router;
