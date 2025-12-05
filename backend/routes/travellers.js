const express = require('express');
const router = express.Router();
const Traveller = require('../models/Traveller');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// @route   GET /api/travellers/current-trip
// @desc    Get current trip details for traveller
// @access  Private
router.get('/current-trip', auth, async (req, res) => {
  try {
    const traveller = await Traveller.findOne({ user: req.user._id })
      .populate({
        path: 'currentTour',
        select: 'title itinerary startDates images destinations duration'
      })
      .populate({
        path: 'currentBooking',
        select: 'bookingId tourDate ticketDetails hotelDetails status passengers'
      });

    if (!traveller || !traveller.currentTour) {
      return res.status(404).json({
        success: false,
        message: 'No active trip found'
      });
    }

    res.json({
      success: true,
      data: {
        tour: traveller.currentTour,
        booking: traveller.currentBooking,
        ticketNumber: traveller.ticketNumber,
        platformNumber: traveller.platformNumber,
        railwayStation: traveller.railwayStation,
        seatNumber: traveller.seatNumber,
        coachNumber: traveller.coachNumber,
        hotelName: traveller.hotelName,
        roomNumber: traveller.roomNumber
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/travellers/itinerary
// @desc    Get day-wise itinerary for current trip
// @access  Private
router.get('/itinerary', auth, async (req, res) => {
  try {
    const traveller = await Traveller.findOne({ user: req.user._id })
      .populate({
        path: 'currentTour',
        select: 'title itinerary duration'
      });

    if (!traveller || !traveller.currentTour) {
      return res.status(404).json({
        success: false,
        message: 'No active trip found'
      });
    }

    res.json({
      success: true,
      data: {
        tourTitle: traveller.currentTour.title,
        duration: traveller.currentTour.duration,
        itinerary: traveller.currentTour.itinerary
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/travellers/stats
// @desc    Get traveller statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const traveller = await Traveller.findOne({ user: req.user._id });

    if (!traveller) {
      return res.status(404).json({
        success: false,
        message: 'Traveller profile not found'
      });
    }

    // Calculate stats
    const stats = {
      totalTrips: traveller.totalTrips,
      membershipTier: traveller.membershipTier,
      loyaltyPoints: traveller.loyaltyPoints,
      destinationsVisited: [...new Set(
        traveller.travelHistory.flatMap(h => h.destinations)
      )].length,
      averageRating: traveller.travelHistory.length > 0
        ? traveller.travelHistory.reduce((sum, h) => sum + (h.rating || 0), 0) / 
          traveller.travelHistory.filter(h => h.rating).length
        : 0
    };

    // Travel by year
    const travelByYear = {};
    traveller.travelHistory.forEach(h => {
      const year = new Date(h.startDate).getFullYear();
      travelByYear[year] = (travelByYear[year] || 0) + 1;
    });

    res.json({
      success: true,
      data: { stats, travelByYear }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADMIN ROUTES

// @route   GET /api/travellers
// @desc    Get all travellers (Admin)
// @access  Private/Admin
router.get('/', [auth, isAdmin], async (req, res) => {
  try {
    const { page = 1, limit = 20, search, tier } = req.query;

    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' }
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'userInfo.name': { $regex: search, $options: 'i' } },
            { 'userInfo.email': { $regex: search, $options: 'i' } },
            { 'userInfo.phone': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    if (tier) {
      pipeline.push({ $match: { membershipTier: tier } });
    }

    pipeline.push(
      { $sort: { totalTrips: -1 } },
      { $skip: (page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    );

    const travellers = await Traveller.aggregate(pipeline);
    const total = await Traveller.countDocuments();

    res.json({
      success: true,
      data: {
        travellers,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/travellers/:id
// @desc    Get traveller by ID (Admin)
// @access  Private/Admin
router.get('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const traveller = await Traveller.findById(req.params.id)
      .populate('user', 'name email phone address profileImage')
      .populate('travelHistory.tour', 'title category')
      .populate('currentTour', 'title');

    if (!traveller) {
      return res.status(404).json({ success: false, message: 'Traveller not found' });
    }

    res.json({ success: true, data: traveller });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/travellers/:id/travel-details
// @desc    Update traveller travel details (Admin)
// @access  Private/Admin
router.put('/:id/travel-details', [auth, isAdmin], async (req, res) => {
  try {
    const {
      ticketNumber,
      platformNumber,
      railwayStation,
      seatNumber,
      coachNumber,
      hotelName,
      hotelAddress,
      roomNumber,
      checkInDate,
      checkOutDate,
      currentTour,
      currentBooking
    } = req.body;

    const traveller = await Traveller.findByIdAndUpdate(
      req.params.id,
      {
        ticketNumber,
        platformNumber,
        railwayStation,
        seatNumber,
        coachNumber,
        hotelName,
        hotelAddress,
        roomNumber,
        checkInDate,
        checkOutDate,
        currentTour,
        currentBooking
      },
      { new: true }
    );

    if (!traveller) {
      return res.status(404).json({ success: false, message: 'Traveller not found' });
    }

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('travel_details_updated', { travellerId: req.params.id });

    res.json({
      success: true,
      message: 'Travel details updated successfully',
      data: traveller
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/travellers/:id/add-history
// @desc    Add travel history entry (Admin)
// @access  Private/Admin
router.post('/:id/add-history', [auth, isAdmin], async (req, res) => {
  try {
    const traveller = await Traveller.findById(req.params.id);

    if (!traveller) {
      return res.status(404).json({ success: false, message: 'Traveller not found' });
    }

    await traveller.addTravelHistory(req.body);

    res.json({
      success: true,
      message: 'Travel history added',
      data: {
        totalTrips: traveller.totalTrips,
        membershipTier: traveller.membershipTier
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

