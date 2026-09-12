/**
 * Centralized Error Handling Middleware for Express.
 * 
 * Concept Explanation:
 * - What it is: A specialized Express function with 4 arguments (err, req, res, next) that catches all server errors.
 * - Why we need it: Prevents server crashes, hides internal error stack traces from users, and returns standardized JSON error responses.
 * - Where we use it: Mounted at the end of all middleware and routes in server.js.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Bad ObjectId Error (CastError)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Handle Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  console.error(`[Error Handler] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
