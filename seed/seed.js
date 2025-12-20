import mongoose from "mongoose";
import ParkingSpot from "./models/ParkingSpot.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

await ParkingSpot.deleteMany();

const spots = [];

for (let i = 1; i <= 20; i++) {
    spots.push({
        spotNumber: `A${i}`,
        status: "free"
    });
}

await ParkingSpot.insertMany(spots);
console.log("✅ 20 Parking Spots Created");
process.exit();
