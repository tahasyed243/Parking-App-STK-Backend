import express from "express";
import ParkingSpot from "../models/ParkingSpot.js";

const router = express.Router();

// Get all spots
router.get("/", async (req, res) => {
    try {
        const spots = await ParkingSpot.find();
        res.json({ data: spots });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reserve a spot
router.put("/:id/reserve", async (req, res) => {
    try {
        const { name, minutes } = req.body;
        const spot = await ParkingSpot.findById(req.params.id);

        if (!spot) return res.status(404).json({ error: "Spot not found" });
        if (spot.status !== "free") return res.status(400).json({ error: "Spot not available" });

        spot.status = "reserved";
        spot.reservedBy = name;
        spot.reservedUntil = new Date(Date.now() + minutes * 60000);
        await spot.save();

        res.json({ message: "Spot reserved", spot });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Free a spot
router.put("/:id/free", async (req, res) => {
    try {
        const spot = await ParkingSpot.findById(req.params.id);

        if (!spot) return res.status(404).json({ error: "Spot not found" });

        spot.status = "free";
        spot.reservedBy = null;
        spot.reservedUntil = null;
        spot.occupiedBy = null;
        await spot.save();

        res.json({ message: "Spot freed", spot });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Occupy a spot
router.put("/:id/occupy", async (req, res) => {
    try {
        const spot = await ParkingSpot.findById(req.params.id);

        if (!spot) return res.status(404).json({ error: "Spot not found" });
        if (spot.status === "occupied") return res.status(400).json({ error: "Spot already occupied" });

        spot.status = "occupied";
        await spot.save();

        res.json({ message: "Spot occupied", spot });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;