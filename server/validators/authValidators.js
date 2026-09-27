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
 * Registration Rules
 */
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail({ gmail_remove_dots: false }),
  body('phone').trim().isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['customer', 'organizer'])
    .withMessage('Registration role must be either customer or organizer'),
  validateResult
];

/**
 * Login Rules
 */
const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail({ gmail_remove_dots: false }),
  body('password').notEmpty().withMessage('Password is required'),
  validateResult
];

module.exports = {
  registerValidation,
  loginValidation
};
