// server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parking')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('⚠️ MongoDB Warning:', err.message));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚗 ParkEase API Running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/spots', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, spotNumber: 'A1', available: true },
      { id: 2, spotNumber: 'A2', available: false }
    ]
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
