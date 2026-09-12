const { body, validationResult } = require('express-validator');

/**
 * Validation Middleware Result Checker
 */
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({
      success: false,
      message: errorMessages
    });
  }
  next();
};

/**
 * Booking Validation Rules
 */
const bookingValidation = [
  body('eventId').notEmpty().withMessage('Event ID reference is required'),
  body('tickets')
    .isArray({ min: 1 })
    .withMessage('At least one ticket selection is required'),
  body('tickets.*.ticketTypeId').notEmpty().withMessage('Ticket type ID is required'),
  body('tickets.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Ticket quantity must be at least 1'),
  validateResult
];

module.exports = {
  bookingValidation
};
