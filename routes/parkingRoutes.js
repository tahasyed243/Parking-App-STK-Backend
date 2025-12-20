import express from 'express';
import {
  getSpots,
  getSpotById,
  createSpot,
  bookSpot,
  releaseSpot,
  occupySpot
} from '../controllers/parkingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSpots);
router.get('/:id', getSpotById);
router.post('/', protect, admin, createSpot);
router.put('/:id/book', protect, bookSpot);
router.put('/:id/release', protect, releaseSpot);
router.put('/:id/occupy', protect, occupySpot);

export default router;