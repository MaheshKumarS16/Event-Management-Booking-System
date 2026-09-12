const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Database
connectDB();

// Initialize Express Application
const app = express();

// Security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing (CORS) setup
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware for handling JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);

// Catch 404 for non-existing endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`
  });
});

// Centralized Error Handler Middleware
app.use(errorHandler);

// Define Server Port
const PORT = process.env.PORT || 5000;

// Start Server Listening
const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  🎉 Eventify Server running on port ${PORT}`);
  console.log(`  📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  🔐 Auth Endpoint: http://localhost:${PORT}/api/auth`);
  console.log(`  🎪 Events Endpoint: http://localhost:${PORT}/api/events`);
  console.log(`  🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`==================================================`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
  server.close(() => process.exit(1));
});
