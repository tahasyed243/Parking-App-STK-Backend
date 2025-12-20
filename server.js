import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// SIMPLE MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parking-app')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('⚠️ MongoDB Warning:', err.message));

const app = express();

// SIMPLE CORS
app.use(cors());
app.use(express.json());

// SIMPLE Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚗 ParkEase Backend API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Auth Routes (SIMPLE)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, vehicleNumber } = req.body;
    
    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    
    res.json({
      success: true,
      message: 'User registered successfully',
      user: { name, email, phone, vehicleNumber }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    
    res.json({
      success: true,
      message: 'Login successful',
      token: 'demo-token-' + Date.now(),
      user: { name: email.split('@')[0], email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Parking Spots Routes (SIMPLE)
app.get('/api/spots', async (req, res) => {
  try {
    // Try to get from MongoDB
    const Spot = mongoose.model('Spot') || 
      mongoose.model('Spot', new mongoose.Schema({
        spotNumber: String,
        location: String,
        isAvailable: Boolean
      }));
    
    const spots = await Spot.find().catch(() => []);
    
    // If no spots in DB, return mock data
    if (!spots || spots.length === 0) {
      return res.json({
        success: true,
        data: [
          { _id: '1', spotNumber: 'A1', location: 'A', isAvailable: true, pricePerHour: 20 },
          { _id: '2', spotNumber: 'A2', location: 'A', isAvailable: false, pricePerHour: 20 },
          { _id: '3', spotNumber: 'B1', location: 'B', isAvailable: true, pricePerHour: 30 }
        ]
      });
    }
    
    res.json({ success: true, data: spots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/spots/:id/book', (req, res) => {
  try {
    const { hours } = req.body;
    res.json({
      success: true,
      message: `Spot ${req.params.id} booked for ${hours || 1} hour(s)`,
      totalPrice: (hours || 1) * 20
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/spots/:id/release', (req, res) => {
  res.json({
    success: true,
    message: `Spot ${req.params.id} released successfully`
  });
});

app.put('/api/spots/:id/occupy', (req, res) => {
  res.json({
    success: true,
    message: `Spot ${req.params.id} marked as occupied`
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});