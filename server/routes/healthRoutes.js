const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

/**
 * GET /api/health
 * Health check route to verify backend & database communication.
 * 
 * Concept Explanation:
 * - What it is: A lightweight REST endpoint used to check server operational status.
 * - Why we need it: Allows frontend client and external monitors to check if backend API is online and database is connected.
 * - Where we use it: Used during initial setup verification and testing.
 */
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.status(200).json({
    success: true,
    message: 'Eventify Backend API is running smoothly!',
    data: {
      server: 'Online',
      environment: process.env.NODE_ENV || 'development',
      database: dbStatusMap[dbState] || 'Unknown',
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
