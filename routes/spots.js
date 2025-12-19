import express from "express";
import ParkingSpot from "../models/ParkingSpot.js";

const router = express.Router();

// GET all parking spots
router.get("/", async (req, res) => {
    try {
        const spots = await ParkingSpot.find();
        res.json(spots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// RESERVE a spot
router.post("/reserve/:id", async (req, res) => {
    const { id } = req.params;
    const { name, minutes } = req.body;

    try {
        const spot = await ParkingSpot.findById(id);
        if (!spot) return res.status(404).json({ message: "Spot not found" });
        if (spot.status !== "free")
            return res.status(400).json({ message: "Spot not available" });

        spot.status = "reserved";
        spot.reservedBy = name;
        spot.reservedUntil = Date.now() + minutes * 60000; // milliseconds
        await spot.save();

        res.json(spot);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// OCCUPY a spot
router.post("/occupy/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const spot = await ParkingSpot.findById(id);
        if (!spot) return res.status(404).json({ message: "Spot not found" });

        spot.status = "occupied";
        spot.reservedBy = null;
        spot.reservedUntil = null;
        await spot.save();

        res.json(spot);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// FREE a spot
router.post("/free/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const spot = await ParkingSpot.findById(id);
        if (!spot) return res.status(404).json({ message: "Spot not found" });

        spot.status = "free";
        spot.reservedBy = null;
        spot.reservedUntil = null;
        await spot.save();

        res.json(spot);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
