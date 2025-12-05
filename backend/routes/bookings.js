const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const Traveller = require('../models/Traveller');
const { auth, isAdmin } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', [
  auth,
  body('tour').notEmpty().withMessage('Tour ID is required'),
  body('tourDate').isISO8601().withMessage('Valid tour date is required'),
  body('passengers').isArray({ min: 1 }).withMessage('At least one passenger is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { tour: tourId, tourDate, passengers, specialRequests } = req.body;

    // Get tour details
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    // Check availability
    const selectedDate = tour.startDates.find(
      d => new Date(d.date).toDateString() === new Date(tourDate).toDateString()
    );

    if (!selectedDate || selectedDate.availableSeats < passengers.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'Not enough seats available for selected date' 
      });
    }

    // Calculate pricing
    const basePrice = tour.price.discountedAmount || tour.price.amount;
    const totalBasePrice = basePrice * passengers.length;
    const taxes = Math.round(totalBasePrice * 0.05); // 5% tax
    const totalAmount = totalBasePrice + taxes;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      tour: tourId,
      tourDate: new Date(tourDate),
      passengers,
      totalPassengers: passengers.length,
      basePrice: totalBasePrice,
      taxes,
      totalAmount,
      specialRequests
    });

    await booking.save();

    // Update available seats
    selectedDate.availableSeats -= passengers.length;
    await tour.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('tour', 'title images category duration')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
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

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      $or: [
        { user: req.user._id },
        ...(req.user.role === 'admin' || req.user.role === 'super_admin' ? [{}] : [])
      ]
    })
      .populate('tour', 'title images category duration itinerary destinations')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel this booking' 
      });
    }

    // Calculate refund based on cancellation policy
    const daysUntilTour = Math.ceil(
      (new Date(booking.tourDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    let refundPercent = 0;
    if (daysUntilTour > 30) refundPercent = 90;
    else if (daysUntilTour > 15) refundPercent = 70;
    else if (daysUntilTour > 7) refundPercent = 50;
    else if (daysUntilTour > 3) refundPercent = 25;

    const refundAmount = Math.round(booking.paidAmount * (refundPercent / 100));

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();
    booking.refundAmount = refundAmount;
    booking.refundStatus = refundAmount > 0 ? 'pending' : undefined;

    await booking.save();

    // Restore seats
    const tour = await Tour.findById(booking.tour);
    const selectedDate = tour.startDates.find(
      d => new Date(d.date).toDateString() === new Date(booking.tourDate).toDateString()
    );
    if (selectedDate) {
      selectedDate.availableSeats += booking.totalPassengers;
      await tour.save();
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        refundAmount,
        refundPercent
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADMIN ROUTES

// @route   GET /api/bookings/admin/all
// @desc    Get all bookings (Admin)
// @access  Private/Admin
router.get('/admin/all', [auth, isAdmin], async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      tour, 
      startDate, 
      endDate,
      search 
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (tour) query.tour = tour;
    if (startDate && endDate) {
      query.tourDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .populate('tour', 'title category')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    // Get statistics
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        bookings,
        stats,
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

// @route   PUT /api/bookings/:id/confirm
// @desc    Confirm booking (Admin)
// @access  Private/Admin
router.put('/:id/confirm', [auth, isAdmin], async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' },
      { new: true }
    ).populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Update traveller's current tour
    await Traveller.findOneAndUpdate(
      { user: booking.user._id },
      { currentTour: booking.tour, currentBooking: booking._id }
    );

    // Send notification
    const io = req.app.get('io');
    io.emit('booking_confirmed', { 
      bookingId: booking._id,
      userId: booking.user._id 
    });

    res.json({
      success: true,
      message: 'Booking confirmed',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/ticket-details
// @desc    Update ticket details (Admin)
// @access  Private/Admin
router.put('/:id/ticket-details', [auth, isAdmin], async (req, res) => {
  try {
    const { ticketDetails, hotelDetails } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ticketDetails, hotelDetails },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Also update traveller details
    await Traveller.findOneAndUpdate(
      { user: booking.user },
      {
        ticketNumber: ticketDetails?.ticketNumber,
        platformNumber: ticketDetails?.platform,
        railwayStation: ticketDetails?.departureStation,
        seatNumber: ticketDetails?.seatNumbers?.join(', '),
        coachNumber: ticketDetails?.coach,
        hotelName: hotelDetails?.hotelName,
        hotelAddress: hotelDetails?.address,
        roomNumber: hotelDetails?.roomNumbers?.join(', ')
      }
    );

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('ticket_updated', { bookingId: booking._id, userId: booking.user });

    res.json({
      success: true,
      message: 'Ticket details updated',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/complete
// @desc    Mark booking as completed (Admin)
// @access  Private/Admin
router.put('/:id/complete', [auth, isAdmin], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('tour');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'completed';
    await booking.save();

    // Add to travel history
    const traveller = await Traveller.findOne({ user: booking.user });
    if (traveller) {
      await traveller.addTravelHistory({
        tour: booking.tour._id,
        booking: booking._id,
        startDate: booking.tourDate,
        endDate: new Date(booking.tourDate.getTime() + 
          booking.tour.duration.days * 24 * 60 * 60 * 1000),
        destinations: booking.tour.destinations.map(d => d.name)
      });

      // Add loyalty points
      traveller.loyaltyPoints += Math.floor(booking.totalAmount / 100);
      traveller.currentTour = null;
      traveller.currentBooking = null;
      await traveller.save();
    }

    res.json({
      success: true,
      message: 'Booking marked as completed',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

