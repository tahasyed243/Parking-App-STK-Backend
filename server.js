import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import spotRoutes from "./routes/spots.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://parking-app-stk-frontend.vercel.app',
  'https://parking-app-stk-frontend-34u3d0ssm-tahasyed243s-projects.vercel.app'
];

// SIMPLE CORS SETUP - Remove the problematic options() line
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/spots", spotRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚗 ParkEase Backend API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 MongoDB: ${process.env.MONGODB_URI ? "Atlas" : "Local"}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/`);
});