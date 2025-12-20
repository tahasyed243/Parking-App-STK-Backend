import mongoose from 'mongoose';

const parkingSpotSchema = new mongoose.Schema({
  spotNumber: {
    type: String,
    required: [true, 'Spot number is required'],
    unique: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    enum: ['A', 'B', 'C', 'D']
  },
  type: {
    type: String,
    required: true,
    enum: ['standard', 'premium', 'disabled'],
    default: 'standard'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  pricePerHour: {
    type: Number,
    required: true,
    min: 10
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bookedFrom: {
    type: Date,
    default: null
  },
  bookedUntil: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);
export default ParkingSpot;