import express from "express";

const router = express.Router();

/**
 * In-memory parking spots (20 spots)
 */
let spots = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    spotNumber: `A${i + 1}`,
    status: "free", // free | reserved | occupied
    reservedBy: null,
}));

// ✅ GET all spots
router.get("/", (req, res) => {
    res.json({
        success: true,
        data: spots,
    });
});

// ✅ RESERVE a spot
router.put("/:id/reserve", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const spot = spots.find((s) => s.id == id);

    if (!spot) {
        return res.status(404).json({ success: false, message: "Spot not found" });
    }

    if (spot.status !== "free") {
        return res
            .status(400)
            .json({ success: false, message: "Spot not free" });
    }

    spot.status = "reserved";
    spot.reservedBy = name || "User";

    res.json({ success: true, spot });
});

// ✅ OCCUPY a spot
router.put("/:id/occupy", (req, res) => {
    const { id } = req.params;

    const spot = spots.find((s) => s.id == id);

    if (!spot) {
        return res.status(404).json({ success: false, message: "Spot not found" });
    }

    spot.status = "occupied";

    res.json({ success: true, spot });
});

// ✅ FREE a spot
router.put("/:id/free", (req, res) => {
    const { id } = req.params;

    const spot = spots.find((s) => s.id == id);

    if (!spot) {
        return res.status(404).json({ success: false, message: "Spot not found" });
    }

    spot.status = "free";
    spot.reservedBy = null;

    res.json({ success: true, spot });
});

export default router;
