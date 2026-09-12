const express = require('express');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingController');
const { bookingValidation } = require('../validators/bookingValidators');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Booking REST API Routes
 * 
 * Concept Explanation:
 * - What it is: Express router mapping ticket reservation and cancellation endpoints.
 * - Why we need it: Exposes secure REST endpoints for customer booking creation and history.
 * - Where we use it: Mounted at /api/bookings in server.js.
 */

router.use(authenticateUser); // All booking routes require authentication

router.post('/', bookingValidation, createBooking);
router.get('/', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
