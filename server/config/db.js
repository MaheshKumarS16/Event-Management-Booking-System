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
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    console.error(`[Database Note] Make sure MongoDB server is running locally on port 27017 or update MONGODB_URI in server/.env`);
    // Exit process with failure code if unable to connect
    process.exit(1);
  }
};

module.exports = connectDB;
