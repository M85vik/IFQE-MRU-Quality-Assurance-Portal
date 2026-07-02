// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/ifqe-portal";
    
    if (!process.env.MONGO_URI) {
      console.warn("⚠️  MONGO_URI is not set in .env. Falling back to local database: " + mongoUri);
    }

    const conn = await mongoose.connect(mongoUri, {
      // useNewUrlParser and useUnifiedTopology are deprecated in newer mongoose, but leaving them if existing code relies on it, or we can just pass them cleanly.
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Instead of exiting, we might just log it so the server can start up and show other errors/run dev mode.
    // process.exit(1); 
  }
};

module.exports = connectDB;