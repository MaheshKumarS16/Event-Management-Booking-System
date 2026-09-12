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
 * Event Creation & Update Validation Rules
 */
const eventValidation = [
  body('title').trim().notEmpty().withMessage('Event title is required'),
  body('description').trim().notEmpty().withMessage('Event description is required'),
  body('category').notEmpty().withMessage('Category reference is required'),
  body('image').notEmpty().withMessage('Event image URL is required'),
  body('venue').trim().notEmpty().withMessage('Venue name is required'),
  body('address').trim().notEmpty().withMessage('Venue address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('startDate').notEmpty().withMessage('Start date is required'),
  body('endDate').notEmpty().withMessage('End date is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('ticketTypes')
    .isArray({ min: 1 })
    .withMessage('At least one ticket type must be specified'),
  body('ticketTypes.*.name').trim().notEmpty().withMessage('Ticket type name is required'),
  body('ticketTypes.*.price')
    .isFloat({ min: 0 })
    .withMessage('Ticket price must be a non-negative number'),
  body('ticketTypes.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Ticket quantity must be at least 1'),
  validateResult
];

module.exports = {
  eventValidation
};
