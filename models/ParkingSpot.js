import mongoose from "mongoose";

const parkingSpotSchema = new mongoose.Schema({
  spotNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["free", "reserved", "occupied"],
    default: "free"
  },
  reservedBy: { type: String, default: null },
  reservedUntil: { type: Date, default: null },
  occupiedBy: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

const ParkingSpot = mongoose.model("ParkingSpot", parkingSpotSchema);

export default ParkingSpot;