import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Routes imports
import authRoutes from "./routes/auth.js";
import spotRoutes from "./routes/spots.js";

dotenv.config();

const app = express();

// CORS setup
app.use(cors({
  origin: [
    "https://parking-app-stk-frontend.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/parking");
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/spots", spotRoutes);

// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "Parking App Backend API", status: "running" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// Error handling for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`🌐 Railway: https://parking-app-stk-backend-production.up.railway.app`);
});
