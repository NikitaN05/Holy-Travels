const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Newsletter = require('../models/Newsletter');
const { auth, isAdmin } = require('../middleware/auth');

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, name, phone, preferences } = req.body;

    // Check if already subscribed
    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      if (subscriber.isSubscribed) {
        return res.status(400).json({
          success: false,
          message: 'Email is already subscribed'
        });
      }
      // Resubscribe
      subscriber.isSubscribed = true;
      subscriber.subscribedAt = new Date();
      subscriber.unsubscribedAt = null;
      if (name) subscriber.name = name;
      if (phone) subscriber.phone = phone;
      if (preferences) subscriber.preferences = preferences;
      await subscriber.save();
    } else {
      // Create new subscription
      subscriber = new Newsletter({
        email,
        name,
        phone,
        preferences
      });
      await subscriber.save();
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt
      }
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post('/unsubscribe', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our records'
      });
    }

    subscriber.isSubscribed = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/newsletter/preferences
// @desc    Update newsletter preferences
// @access  Public
router.put('/preferences', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const { email, preferences } = req.body;

    const subscriber = await Newsletter.findOneAndUpdate(
      { email },
      { preferences },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.json({
      success: true,
      message: 'Preferences updated',
      data: subscriber.preferences
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ADMIN ROUTES

// @route   GET /api/newsletter/admin/subscribers
// @desc    Get all subscribers (Admin)
// @access  Private/Admin
router.get('/admin/subscribers', [auth, isAdmin], async (req, res) => {
  try {
    const { page = 1, limit = 50, isSubscribed } = req.query;

    const query = {};
    if (isSubscribed !== undefined) {
      query.isSubscribed = isSubscribed === 'true';
    }

    const subscribers = await Newsletter.find(query)
      .sort({ subscribedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Newsletter.countDocuments(query);
    const activeCount = await Newsletter.countDocuments({ isSubscribed: true });

    res.json({
      success: true,
      data: {
        subscribers,
        stats: {
          total,
          active: activeCount,
          unsubscribed: total - activeCount
        },
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/newsletter/admin/:id
// @desc    Delete subscriber (Admin)
// @access  Private/Admin
router.delete('/admin/:id', [auth, isAdmin], async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Subscriber deleted'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;

