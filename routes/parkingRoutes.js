import express from "express";
import {
  getSpots,
  reserveSpot,
  occupySpot,
  freeSpot,
} from "../controllers/parkingController.js";

const router = express.Router();

router.get("/", getSpots);
router.post("/reserve/:id", reserveSpot);
router.post("/occupy/:id", occupySpot);
router.post("/free/:id", freeSpot);

export default router;
