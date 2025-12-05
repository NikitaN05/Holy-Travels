const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Traveller = require('../models/Traveller');
const { auth, isAdmin } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const traveller = await Traveller.findOne({ user: req.user._id })
      .populate('currentTour', 'title images')
      .populate('travelHistory.tour', 'title destinations');

    res.json({
      success: true,
      data: {
        user,
        traveller,
        maskedAadhar: user.aadharNumber ? 'XXXX-XXXX-' + user.aadharNumber?.slice(-4) : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('name').optional().trim().notEmpty(),
  body('phone').optional().notEmpty(),
  body('preferredLanguage').optional().isIn(['en', 'hi', 'mr'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, phone, address, aadharNumber, preferredLanguage } = req.body;

    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    if (aadharNumber) user.aadharNumber = aadharNumber;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/profile-image
// @desc    Update profile image
// @access  Private
router.put('/profile-image', auth, uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const user = await User.findById(req.user._id);
    user.profileImage = req.file.path || req.file.location;
    await user.save();

    res.json({
      success: true,
      message: 'Profile image updated',
      data: { profileImage: user.profileImage }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/travel-history
// @desc    Get user's travel history
// @access  Private
router.get('/travel-history', auth, async (req, res) => {
  try {
    const traveller = await Traveller.findOne({ user: req.user._id })
      .populate({
        path: 'travelHistory.tour',
        select: 'title images category destinations duration'
      })
      .populate({
        path: 'travelHistory.booking',
        select: 'bookingId tourDate status'
      });

    if (!traveller) {
      return res.status(404).json({ success: false, message: 'Traveller not found' });
    }

    res.json({
      success: true,
      data: {
        totalTrips: traveller.totalTrips,
        membershipTier: traveller.membershipTier,
        loyaltyPoints: traveller.loyaltyPoints,
        history: traveller.travelHistory
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/emergency-contacts
// @desc    Update emergency contacts
// @access  Private
router.put('/emergency-contacts', auth, async (req, res) => {
  try {
    const { emergencyContacts } = req.body;

    let traveller = await Traveller.findOne({ user: req.user._id });
    if (!traveller) {
      traveller = new Traveller({ user: req.user._id });
    }

    traveller.emergencyContacts = emergencyContacts;
    await traveller.save();

    res.json({
      success: true,
      message: 'Emergency contacts updated',
      data: { emergencyContacts: traveller.emergencyContacts }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/medical-info
// @desc    Update medical information
// @access  Private
router.put('/medical-info', auth, async (req, res) => {
  try {
    const { medicalConditions, bloodGroup, allergies } = req.body;

    let traveller = await Traveller.findOne({ user: req.user._id });
    if (!traveller) {
      traveller = new Traveller({ user: req.user._id });
    }

    if (medicalConditions) traveller.medicalConditions = medicalConditions;
    if (bloodGroup) traveller.bloodGroup = bloodGroup;
    if (allergies) traveller.allergies = allergies;

    await traveller.save();

    res.json({
      success: true,
      message: 'Medical information updated',
      data: {
        medicalConditions: traveller.medicalConditions,
        bloodGroup: traveller.bloodGroup,
        allergies: traveller.allergies
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, async (req, res) => {
  try {
    const { dietaryPreferences, mealPreferences, specialRequirements } = req.body;

    let traveller = await Traveller.findOne({ user: req.user._id });
    if (!traveller) {
      traveller = new Traveller({ user: req.user._id });
    }

    if (dietaryPreferences) traveller.dietaryPreferences = dietaryPreferences;
    if (mealPreferences) traveller.mealPreferences = mealPreferences;
    if (specialRequirements) traveller.specialRequirements = specialRequirements;

    await traveller.save();

    res.json({
      success: true,
      message: 'Preferences updated',
      data: {
        dietaryPreferences: traveller.dietaryPreferences,
        mealPreferences: traveller.mealPreferences,
        specialRequirements: traveller.specialRequirements
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADMIN ROUTES

// @route   GET /api/users
// @desc    Get all users (Admin)
// @access  Private/Admin
router.get('/', [auth, isAdmin], async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, isActive } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
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

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin)
// @access  Private/Admin
router.get('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    const traveller = await Traveller.findOne({ user: req.params.id })
      .populate('travelHistory.tour', 'title')
      .populate('currentTour', 'title');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: { user, traveller }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/status
// @desc    Update user status (Admin)
// @access  Private/Admin
router.put('/:id/status', [auth, isAdmin], async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

