const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { auth, isAdmin, optionalAuth } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// @route   GET /api/reviews/tour/:tourId
// @desc    Get reviews for a tour
// @access  Public
router.get('/tour/:tourId', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const reviews = await Review.find({
      tour: req.params.tourId,
      status: 'approved'
    })
      .populate('user', 'name profileImage')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      tour: req.params.tourId,
      status: 'approved'
    });

    // Calculate rating distribution
    const ratingDist = await Review.aggregate([
      { $match: { tour: req.params.tourId, status: 'approved' } },
      { $group: { _id: '$ratings.overall', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        ratingDistribution: ratingDist,
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

// @route   GET /api/reviews/featured
// @desc    Get featured reviews
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    // First try featured reviews
    let reviews = await Review.find({ status: 'approved', isFeatured: true })
      .populate('user', 'name profileImage')
      .populate('tour', 'title slug images')
      .limit(6);

    // If no featured reviews, get highest rated reviews
    if (reviews.length === 0) {
      reviews = await Review.find({ status: 'approved', 'ratings.overall': { $gte: 4 } })
        .populate('user', 'name profileImage')
        .populate('tour', 'title slug images')
        .sort('-ratings.overall -createdAt')
        .limit(6);
    }

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Get featured reviews error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Create review
// @access  Private
router.post('/', [
  auth,
  body('tour').notEmpty().withMessage('Tour ID is required'),
  body('ratings.overall').isInt({ min: 1, max: 5 }).withMessage('Overall rating is required'),
  body('review').notEmpty().withMessage('Review text is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { tour, ratings, title, review, highlights, improvements, travellerType, booking } = req.body;

    // Check if user already reviewed this tour
    const existingReview = await Review.findOne({ user: req.user._id, tour });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this tour'
      });
    }

    // Verify booking if provided
    let isVerifiedPurchase = false;
    let travelDate;
    if (booking) {
      const bookingDoc = await Booking.findOne({
        _id: booking,
        user: req.user._id,
        tour,
        status: 'completed'
      });
      if (bookingDoc) {
        isVerifiedPurchase = true;
        travelDate = bookingDoc.tourDate;
      }
    }

    const newReview = new Review({
      user: req.user._id,
      tour,
      booking,
      ratings,
      title,
      review,
      highlights,
      improvements,
      travellerType,
      travelDate,
      isVerifiedPurchase,
      status: 'pending'
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted for approval',
      data: newReview
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/reviews/:id/photos
// @desc    Add photos to review
// @access  Private
router.post('/:id/photos', [auth, uploadImage.array('photos', 5)], async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const photos = req.files.map((file, index) => ({
      url: file.path || file.location,
      caption: req.body.captions?.[index] || ''
    }));

    review.photos.push(...photos);
    await review.save();

    res.json({
      success: true,
      message: 'Photos added',
      data: { photos: review.photos }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.put('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const index = review.helpfulBy.indexOf(req.user._id);
    if (index > -1) {
      review.helpfulBy.splice(index, 1);
      review.helpfulCount -= 1;
    } else {
      review.helpfulBy.push(req.user._id);
      review.helpfulCount += 1;
    }

    await review.save();

    res.json({
      success: true,
      data: {
        helpful: index === -1,
        helpfulCount: review.helpfulCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/reviews/my-reviews
// @desc    Get user's reviews
// @access  Private
router.get('/my-reviews', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('tour', 'title slug images')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADMIN ROUTES

// @route   GET /api/reviews/admin/pending
// @desc    Get pending reviews (Admin)
// @access  Private/Admin
router.get('/admin/pending', [auth, isAdmin], async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('tour', 'title')
      .sort({ createdAt: 1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id/approve
// @desc    Approve review (Admin)
// @access  Private/Admin
router.put('/:id/approve', [auth, isAdmin], async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        moderatedBy: req.user._id,
        moderatedAt: new Date()
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, message: 'Review approved', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id/reject
// @desc    Reject review (Admin)
// @access  Private/Admin
router.put('/:id/reject', [auth, isAdmin], async (req, res) => {
  try {
    const { reason } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        moderatedBy: req.user._id,
        moderatedAt: new Date(),
        moderationNotes: reason
      },
      { new: true }
    );

    res.json({ success: true, message: 'Review rejected', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/reviews/:id/respond
// @desc    Add admin response to review (Admin)
// @access  Private/Admin
router.post('/:id/respond', [auth, isAdmin], async (req, res) => {
  try {
    const { response } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        adminResponse: {
          response,
          respondedBy: req.user._id,
          respondedAt: new Date()
        }
      },
      { new: true }
    );

    res.json({ success: true, message: 'Response added', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;


