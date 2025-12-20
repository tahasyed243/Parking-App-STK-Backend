// config/db.js - SIMPLE VERSION
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.log('⚠️ MONGODB_URI not found, using local memory');
      return;
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');
    
  } catch (error) {
    console.log('⚠️ MongoDB Connection Failed:', error.message);
    // Don't exit - continue without DB
  }
};

export default connectDB; 