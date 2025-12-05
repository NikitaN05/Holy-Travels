const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Tour = require('../models/Tour');
const Review = require('../models/Review');
const { auth, isAdmin, optionalAuth } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// @route   GET /api/tours
// @desc    Get all tours
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      duration,
      featured,
      sort = '-createdAt'
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$text = { $search: search };
    }
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = parseInt(minPrice);
      if (maxPrice) query['price.amount'].$lte = parseInt(maxPrice);
    }
    if (duration) {
      query['duration.days'] = parseInt(duration);
    }

    const tours = await Tour.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('title slug shortDescription description category images duration price averageRating totalReviews isFeatured startDates maxGroupSize destinations difficulty');

    const total = await Tour.countDocuments(query);

    res.json({
      success: true,
      data: {
        tours,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/tours/featured
// @desc    Get featured tours
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    // First try to get featured tours
    let tours = await Tour.find({ isActive: true, isFeatured: true })
      .limit(6)
      .sort('-averageRating -createdAt')
      .select('title slug shortDescription description category images duration price averageRating totalReviews isFeatured maxGroupSize');

    // If no featured tours, get top-rated or newest tours
    if (tours.length === 0) {
      tours = await Tour.find({ isActive: true })
        .limit(6)
        .sort('-averageRating -createdAt')
        .select('title slug shortDescription description category images duration price averageRating totalReviews isFeatured maxGroupSize');
    }

    res.json({ success: true, data: tours });
  } catch (error) {
    console.error('Get featured tours error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/tours/categories
// @desc    Get tours grouped by category
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Tour.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/tours/upcoming
// @desc    Get upcoming tours
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    
    const tours = await Tour.find({
      isActive: true,
      'startDates.date': { $gte: today },
      'startDates.status': 'upcoming'
    })
      .limit(10)
      .select('title slug shortDescription category images duration price startDates')
      .sort({ 'startDates.date': 1 });

    res.json({ success: true, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/tours/:slug
// @desc    Get tour by slug
// @access  Public
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug, isActive: true })
      .populate('createdBy', 'name');

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    // Get reviews
    const reviews = await Review.find({ tour: tour._id, status: 'approved' })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: { tour, reviews }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/tours/:id/itinerary
// @desc    Get tour itinerary
// @access  Public
router.get('/:id/itinerary', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .select('title itinerary duration');

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADMIN ROUTES

// @route   POST /api/tours
// @desc    Create new tour
// @access  Private/Admin
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const tourData = { ...req.body, createdBy: req.user._id };
    const tour = new Tour(tourData);
    await tour.save();

    res.status(201).json({
      success: true,
      message: 'Tour created successfully',
      data: tour
    });
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/tours/:id
// @desc    Update tour
// @access  Private/Admin
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    res.json({
      success: true,
      message: 'Tour updated successfully',
      data: tour
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/tours/:id
// @desc    Delete tour (soft delete)
// @access  Private/Admin
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    res.json({
      success: true,
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/tours/:id/images
// @desc    Upload tour images
// @access  Private/Admin
router.post('/:id/images', [auth, isAdmin, uploadImage.array('images', 10)], async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    const newImages = req.files.map((file, index) => ({
      url: file.path || file.location,
      caption: req.body.captions?.[index] || '',
      isMain: tour.images.length === 0 && index === 0
    }));

    tour.images.push(...newImages);
    await tour.save();

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: { images: tour.images }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/tours/:id/start-dates
// @desc    Update tour start dates
// @access  Private/Admin
router.put('/:id/start-dates', [auth, isAdmin], async (req, res) => {
  try {
    const { startDates } = req.body;

    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      { startDates },
      { new: true }
    );

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    res.json({
      success: true,
      message: 'Start dates updated successfully',
      data: { startDates: tour.startDates }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

