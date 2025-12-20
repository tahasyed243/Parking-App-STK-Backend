import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose'; // Direct import
import authRoutes from './routes/auth.js';
import parkingRoutes from './routes/parkingRoutes.js';

// Load environment variables
dotenv.config();

// SIMPLE MongoDB Connection (No separate db.js)
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is missing in environment variables');
      console.log('⚠️ Starting server without database...');
      return;
    }
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected Successfully');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️ Starting server without database connection');
    // Don't crash - run without DB
  }
};

// Connect to MongoDB (non-blocking)
connectDB();

const app = express();

// SIMPLE CORS - allow all for now
app.use(cors({
  origin: '*', // Allow all origins temporarily
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/spots', parkingRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚗 ParkEase Backend API is running',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Simple test endpoints
app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Test endpoint working' });
});

app.get('/api/test-spots', (req, res) => {
  // Return mock data if DB not connected
  res.json({
    success: true,
    data: [
      { id: 1, spotNumber: 'A1', location: 'A', isAvailable: true },
      { id: 2, spotNumber: 'A2', location: 'A', isAvailable: false }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access at: https://parking-app-stk-backend-production.up.railway.app`);
  console.log(`📡 MongoDB Status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`🔗 Health Check: https://parking-app-stk-backend-production.up.railway.app/`);
});