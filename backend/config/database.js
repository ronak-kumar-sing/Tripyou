const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/tourhub',
      {
        // Mongoose 6+ doesn't need useNewUrlParser and useUnifiedTopology
      }
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    return conn;
  } catch (error) {
    console.error('❌ Unable to connect to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

