import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Connect with the simplified modern syntax
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    // Exit the process with failure
    process.exit(1);
  }
};

export default connectDB;