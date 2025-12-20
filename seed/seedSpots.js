import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ParkingSpot from '../models/ParkingSpot.js';

dotenv.config();

const seedSpots = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');

    // Clear existing spots
    await ParkingSpot.deleteMany({});
    console.log('🗑️  Cleared existing spots');

    // Create sample parking spots
    const spots = [
      { spotNumber: 'A1', location: 'A', type: 'standard', pricePerHour: 20, isAvailable: true },
      { spotNumber: 'A2', location: 'A', type: 'standard', pricePerHour: 20, isAvailable: true },
      { spotNumber: 'A3', location: 'A', type: 'premium', pricePerHour: 30, isAvailable: true },
      { spotNumber: 'B1', location: 'B', type: 'standard', pricePerHour: 20, isAvailable: true },
      { spotNumber: 'B2', location: 'B', type: 'premium', pricePerHour: 30, isAvailable: true },
      { spotNumber: 'B3', location: 'B', type: 'disabled', pricePerHour: 15, isAvailable: true },
      { spotNumber: 'C1', location: 'C', type: 'standard', pricePerHour: 20, isAvailable: true },
      { spotNumber: 'C2', location: 'C', type: 'premium', pricePerHour: 30, isAvailable: false, status: 'reserved' },
      { spotNumber: 'C3', location: 'C', type: 'standard', pricePerHour: 20, isAvailable: false, status: 'occupied' },
    ];

    await ParkingSpot.insertMany(spots);
    console.log(`✅ Seeded ${spots.length} parking spots`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedSpots();