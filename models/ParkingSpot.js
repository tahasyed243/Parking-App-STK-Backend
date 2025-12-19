import mongoose from "mongoose";

const parkingSpotSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  status: {
    type: String,
    enum: ["free", "reserved", "occupied"],
    default: "free",
  },
  reservedBy: {
    type: String,
    default: null,
  },
  reservedUntil: {
    type: Number,
    default: null,
  },
});

export default mongoose.model("ParkingSpot", parkingSpotSchema);
