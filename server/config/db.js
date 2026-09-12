const mongoose = require('mongoose');

/**
 * Connects to MongoDB database using Mongoose.
 * 
 * Concept Explanation:
 * - What it is: A helper module that establishes a persistent connection between Node.js and MongoDB.
 * - Why we need it: To perform CRUD operations on MongoDB using Mongoose schemas.
 * - Where we use it: Called during server initialization in server.js.
 */
const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventify_db';

  try {
    // Attempt connecting to primary MongoDB URI (Local MongoDB or Atlas)
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500 // Quick timeout for fast fallback if local service isn't running
    });
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Primary connection to (${primaryUri}) failed: ${error.message}`);
    console.log(`[Database Fallback] Initializing In-Memory MongoDB Server...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] In-Memory MongoDB Connected Successfully at: ${memoryUri}`);
    } catch (fallbackErr) {
      console.error(`[Database Error] Fallback connection failed: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
