import express from "express";
import ParkingSpot from "../models/ParkingSpot.js";

const router = express.Router();

// GET all spots
router.get("/", async (req, res) => {
  const spots = await ParkingSpot.find();
  res.json({ success: true, data: spots });
});

// RESERVE spot
router.put("/:id/reserve", async (req, res) => {
  const { name, minutes } = req.body;

  const spot = await ParkingSpot.findById(req.params.id);
  if (!spot || spot.status !== "free")
    return res.status(400).json({ message: "Spot not available" });

  spot.status = "reserved";
  spot.reservedBy = name;
  spot.reservedUntil = new Date(Date.now() + minutes * 60000);

  await spot.save();
  res.json(spot);
});

// OCCUPY spot
router.put("/:id/occupy", async (req, res) => {
  const spot = await ParkingSpot.findById(req.params.id);
  if (!spot || spot.status === "occupied")
    return res.status(400).json({ message: "Cannot occupy" });

  spot.status = "occupied";
  await spot.save();
  res.json(spot);
});

// FREE spot
router.put("/:id/free", async (req, res) => {
  const spot = await ParkingSpot.findById(req.params.id);

  spot.status = "free";
  spot.reservedBy = null;
  spot.reservedUntil = null;

  await spot.save();
  res.json(spot);
});

export default router;
