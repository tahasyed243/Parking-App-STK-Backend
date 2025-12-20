import ParkingSpot from '../models/ParkingSpot.js';

// @desc    Get all parking spots
// @route   GET /api/spots
export const getSpots = async (req, res) => {
  try {
    const { location, type, available } = req.query;
    let filter = {};

    if (location) filter.location = location;
    if (type) filter.type = type;
    if (available) filter.isAvailable = available === 'true';

    const spots = await ParkingSpot.find(filter);

    res.json({
      success: true,
      count: spots.length,
      data: spots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single parking spot
// @route   GET /api/spots/:id
export const getSpotById = async (req, res) => {
  try {
    const spot = await ParkingSpot.findById(req.params.id);

    if (!spot) {
      return res.status(404).json({
        success: false,
        message: 'Spot not found'
      });
    }

    res.json({
      success: true,
      data: spot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create parking spot (Admin only)
// @route   POST /api/spots
export const createSpot = async (req, res) => {
  try {
    const spot = await ParkingSpot.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Spot created successfully',
      data: spot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Book a parking spot
// @route   PUT /api/spots/:id/book
export const bookSpot = async (req, res) => {
  try {
    const { hours } = req.body;
    const spot = await ParkingSpot.findById(req.params.id);

    if (!spot) {
      return res.status(404).json({
        success: false,
        message: 'Spot not found'
      });
    }

    if (!spot.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Spot is already booked'
      });
    }

    const bookedFrom = new Date();
    const bookedUntil = new Date(bookedFrom.getTime() + (hours * 60 * 60 * 1000));

    spot.isAvailable = false;
    spot.status = 'reserved';
    spot.bookedBy = req.user.id;
    spot.bookedFrom = bookedFrom;
    spot.bookedUntil = bookedUntil;

    await spot.save();

    res.json({
      success: true,
      message: 'Spot booked successfully',
      data: spot,
      totalPrice: hours * spot.pricePerHour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Release a parking spot
// @route   PUT /api/spots/:id/release
export const releaseSpot = async (req, res) => {
  try {
    const spot = await ParkingSpot.findById(req.params.id);

    if (!spot) {
      return res.status(404).json({
        success: false,
        message: 'Spot not found'
      });
    }

    // Check if user booked this spot
    if (spot.bookedBy.toString() !== req.user.id.toString() && !req.user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to release this spot'
      });
    }

    spot.isAvailable = true;
    spot.status = 'free';
    spot.bookedBy = null;
    spot.bookedFrom = null;
    spot.bookedUntil = null;

    await spot.save();

    res.json({
      success: true,
      message: 'Spot released successfully',
      data: spot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Occupy a parking spot
// @route   PUT /api/spots/:id/occupy
export const occupySpot = async (req, res) => {
  try {
    const spot = await ParkingSpot.findById(req.params.id);

    if (!spot) {
      return res.status(404).json({
        success: false,
        message: 'Spot not found'
      });
    }

    spot.status = 'occupied';
    await spot.save();

    res.json({
      success: true,
      message: 'Spot marked as occupied',
      data: spot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};