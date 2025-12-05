const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const Traveller = require('../models/Traveller');
const Emergency = require('../models/Emergency');
const Review = require('../models/Review');
const { auth, isAdmin, isSuperAdmin } = require('../middleware/auth');

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', [auth, isAdmin], async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Basic stats
    const [
      totalUsers,
      totalTours,
      totalBookings,
      activeEmergencies,
      pendingReviews
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Tour.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Emergency.countDocuments({ status: { $in: ['active', 'acknowledged'] } }),
      Review.countDocuments({ status: 'pending' })
    ]);

    // Monthly bookings
    const monthlyBookings = await Booking.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Revenue stats
    const revenueStats = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$paidAmount' }
        }
      }
    ]);

    // Monthly revenue
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'completed'] },
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('tour', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly booking trends (last 6 months)
    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top tours
    const topTours = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: '$tour', bookings: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'tours',
          localField: '_id',
          foreignField: '_id',
          as: 'tour'
        }
      },
      { $unwind: '$tour' },
      { $project: { title: '$tour.title.en', bookings: 1, revenue: 1 } }
    ]);

    // Traveller tiers
    const travellerTiers = await Traveller.aggregate([
      { $group: { _id: '$membershipTier', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalTours,
          totalBookings,
          monthlyBookings,
          activeEmergencies,
          pendingReviews,
          totalRevenue: revenueStats[0]?.totalRevenue || 0,
          monthlyRevenue: monthlyRevenue[0]?.revenue || 0
        },
        bookingsByStatus,
        recentBookings,
        bookingTrends,
        topTours,
        travellerTiers
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/analytics/tours
// @desc    Get tour analytics
// @access  Private/Admin
router.get('/analytics/tours', [auth, isAdmin], async (req, res) => {
  try {
    // Tours by category
    const toursByCategory = await Tour.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Average ratings
    const avgRatings = await Tour.aggregate([
      { $match: { isActive: true, totalReviews: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$averageRating' },
          totalReviews: { $sum: '$totalReviews' }
        }
      }
    ]);

    // Tours with upcoming dates
    const upcomingTours = await Tour.find({
      isActive: true,
      'startDates.date': { $gte: new Date() },
      'startDates.status': 'upcoming'
    }).select('title startDates category').limit(10);

    res.json({
      success: true,
      data: {
        toursByCategory,
        avgRatings: avgRatings[0] || { avgRating: 0, totalReviews: 0 },
        upcomingTours
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/analytics/travellers
// @desc    Get traveller analytics
// @access  Private/Admin
router.get('/analytics/travellers', [auth, isAdmin], async (req, res) => {
  try {
    // Travel frequency distribution
    const travelFrequency = await Traveller.aggregate([
      {
        $bucket: {
          groupBy: '$totalTrips',
          boundaries: [0, 1, 3, 5, 10, 20, 100],
          default: '20+',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    // Top travellers
    const topTravellers = await Traveller.find()
      .populate('user', 'name email')
      .sort({ totalTrips: -1 })
      .limit(10)
      .select('totalTrips membershipTier loyaltyPoints');

    // Membership tier distribution
    const tierDistribution = await Traveller.aggregate([
      { $group: { _id: '$membershipTier', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        travelFrequency,
        topTravellers,
        tierDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/users/search
// @desc    Search users
// @access  Private/Admin
router.get('/users/search', [auth, isAdmin], async (req, res) => {
  try {
    const { q } = req.query;

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ]
    })
      .select('name email phone role')
      .limit(10);

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role (Super Admin only)
// @access  Private/SuperAdmin
router.put('/users/:id/role', [auth, isSuperAdmin], async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/export/bookings
// @desc    Export bookings data
// @access  Private/Admin
router.get('/export/bookings', [auth, isAdmin], async (req, res) => {
  try {
    const { startDate, endDate, tour, status } = req.query;

    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (tour) query.tour = tour;
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('tour', 'title')
      .sort({ createdAt: -1 });

    // Format for CSV
    const csvData = bookings.map(b => ({
      bookingId: b.bookingId,
      userName: b.user?.name,
      userEmail: b.user?.email,
      userPhone: b.user?.phone,
      tourTitle: b.tour?.title?.en,
      tourDate: b.tourDate,
      totalPassengers: b.totalPassengers,
      totalAmount: b.totalAmount,
      paidAmount: b.paidAmount,
      status: b.status,
      paymentStatus: b.paymentStatus,
      createdAt: b.createdAt
    }));

    res.json({ success: true, data: csvData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

