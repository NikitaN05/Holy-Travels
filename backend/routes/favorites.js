const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tour = require('../models/Tour');
const { auth } = require('../middleware/auth');

// @route   GET /api/favorites
// @desc    Get user's favorite tours
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favoriteTours',
        select: 'title images category duration price averageRating totalReviews destinations isActive',
        match: { isActive: true }
      });

    const favorites = user.favoriteTours.map(tour => ({
      id: tour._id,
      title: tour.title,
      image: tour.images?.find(img => img.isMain)?.url || tour.images?.[0]?.url,
      category: tour.category,
      duration: tour.duration,
      price: tour.price.discountedAmount || tour.price.amount,
      originalPrice: tour.price.discountedAmount ? tour.price.amount : null,
      rating: tour.averageRating,
      reviews: tour.totalReviews,
      destinations: tour.destinations?.map(d => d.name).slice(0, 3)
    }));

    res.json({
      success: true,
      data: {
        favorites,
        count: favorites.length
      }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/favorites/:tourId
// @desc    Add tour to favorites
// @access  Private
router.post('/:tourId', auth, async (req, res) => {
  try {
    const { tourId } = req.params;

    // Check if tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    const user = await User.findById(req.user._id);

    // Check if already in favorites
    if (user.favoriteTours.includes(tourId)) {
      return res.status(400).json({
        success: false,
        message: 'Tour already in favorites'
      });
    }

    // Add to favorites
    user.favoriteTours.push(tourId);
    await user.save();

    res.json({
      success: true,
      message: 'Tour added to favorites',
      data: {
        tourId,
        totalFavorites: user.favoriteTours.length
      }
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/favorites/:tourId
// @desc    Remove tour from favorites
// @access  Private
router.delete('/:tourId', auth, async (req, res) => {
  try {
    const { tourId } = req.params;

    const user = await User.findById(req.user._id);

    // Check if in favorites
    const index = user.favoriteTours.indexOf(tourId);
    if (index === -1) {
      return res.status(400).json({
        success: false,
        message: 'Tour not in favorites'
      });
    }

    // Remove from favorites
    user.favoriteTours.splice(index, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Tour removed from favorites',
      data: {
        tourId,
        totalFavorites: user.favoriteTours.length
      }
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/favorites/check/:tourId
// @desc    Check if tour is in favorites
// @access  Private
router.get('/check/:tourId', auth, async (req, res) => {
  try {
    const { tourId } = req.params;

    const user = await User.findById(req.user._id);
    const isFavorite = user.favoriteTours.includes(tourId);

    res.json({
      success: true,
      data: {
        tourId,
        isFavorite
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/favorites/toggle/:tourId
// @desc    Toggle tour in favorites
// @access  Private
router.post('/toggle/:tourId', auth, async (req, res) => {
  try {
    const { tourId } = req.params;

    // Check if tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    const user = await User.findById(req.user._id);
    const index = user.favoriteTours.indexOf(tourId);

    let action;
    if (index === -1) {
      // Add to favorites
      user.favoriteTours.push(tourId);
      action = 'added';
    } else {
      // Remove from favorites
      user.favoriteTours.splice(index, 1);
      action = 'removed';
    }

    await user.save();

    res.json({
      success: true,
      message: `Tour ${action} ${action === 'added' ? 'to' : 'from'} favorites`,
      data: {
        tourId,
        isFavorite: action === 'added',
        totalFavorites: user.favoriteTours.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

