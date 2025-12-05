const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Traveller = require('../models/Traveller');
const { auth } = require('../middleware/auth');

// Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'holy_travels_secret_key',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phone, address, aadharNumber, preferredLanguage } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Create user
    user = new User({
      name,
      email,
      password,
      phone,
      address,
      aadharNumber,
      preferredLanguage
    });

    await user.save();

    // Create traveller profile
    const traveller = new Traveller({ user: user._id });
    await traveller.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          preferredLanguage: user.preferredLanguage
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is deactivated. Please contact support.' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          profileImage: user.profileImage
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const traveller = await Traveller.findOne({ user: req.user._id });

    res.json({
      success: true,
      data: {
        user,
        traveller
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error during logout' 
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', [
  auth,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/auth/update-device-token
// @desc    Update device token for push notifications
// @access  Private
router.put('/update-device-token', auth, async (req, res) => {
  try {
    const { token, platform } = req.body;

    const user = await User.findById(req.user._id);
    
    // Remove existing token for this platform
    user.deviceTokens = user.deviceTokens.filter(t => t.platform !== platform);
    
    // Add new token
    user.deviceTokens.push({ token, platform });
    await user.save();

    res.json({
      success: true,
      message: 'Device token updated'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/auth/google
// @desc    Google OAuth authentication
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { credential, clientId } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with same email (local account)
      user = await User.findOne({ email });

      if (user) {
        // Link Google account to existing local account
        user.googleId = googleId;
        user.authProvider = user.authProvider === 'local' ? 'local' : 'google';
        if (picture && !user.profileImage) {
          user.profileImage = picture;
        }
        await user.save();
      } else {
        // Create new user with Google account
        user = new User({
          name,
          email,
          googleId,
          authProvider: 'google',
          profileImage: picture || '',
          isActive: true
        });
        await user.save();

        // Create traveller profile
        const traveller = new Traveller({ user: user._id });
        await traveller.save();
      }
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          profileImage: user.profileImage,
          authProvider: user.authProvider
        },
        token
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
});

// @route   POST /api/auth/google/mobile
// @desc    Google OAuth for mobile app (using access token)
// @access  Public
router.post('/google/mobile', async (req, res) => {
  try {
    const { accessToken, user: googleUser } = req.body;

    if (!accessToken || !googleUser) {
      return res.status(400).json({
        success: false,
        message: 'Access token and user info are required'
      });
    }

    const { id: googleId, email, name, photo } = googleUser;

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with same email
      user = await User.findOne({ email });

      if (user) {
        // Link Google account
        user.googleId = googleId;
        if (photo && !user.profileImage) {
          user.profileImage = photo;
        }
        await user.save();
      } else {
        // Create new user
        user = new User({
          name,
          email,
          googleId,
          authProvider: 'google',
          profileImage: photo || '',
          isActive: true
        });
        await user.save();

        // Create traveller profile
        const traveller = new Traveller({ user: user._id });
        await traveller.save();
      }
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          profileImage: user.profileImage,
          authProvider: user.authProvider
        },
        token
      }
    });
  } catch (error) {
    console.error('Google mobile auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
});

module.exports = router;

