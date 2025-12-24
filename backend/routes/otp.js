const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const OTP = require('../models/OTP');
const User = require('../models/User');
const Traveller = require('../models/Traveller');

// Twilio client
const twilio = require('twilio');
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'holy_travels_secret_key',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/otp/send
// @desc    Send OTP via SMS or WhatsApp
// @access  Public
router.post('/send', [
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('channel').isIn(['sms', 'whatsapp']).withMessage('Channel must be sms or whatsapp')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { phone, channel, type = 'login' } = req.body;

    // Format phone number (add +91 for India if not present)
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone;
    }
    formattedPhone = '+' + formattedPhone;

    // Delete any existing OTP for this phone
    await OTP.deleteMany({ phone: formattedPhone });

    // Generate new OTP
    const otpCode = OTP.generateOTP();
    
    // Set expiry (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP to database
    const otp = new OTP({
      phone: formattedPhone,
      otp: otpCode,
      type,
      channel,
      expiresAt
    });
    await otp.save();

    // Send OTP via Twilio
    const messageBody = `Your Holy Travels verification code is: ${otpCode}. Valid for 5 minutes. Do not share this code.`;

    if (channel === 'whatsapp') {
      await twilioClient.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${formattedPhone}`,
        body: messageBody
      });
    } else {
      await twilioClient.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone,
        body: messageBody
      });
    }

    res.json({
      success: true,
      message: `OTP sent successfully via ${channel}`,
      data: {
        phone: formattedPhone.replace(/(\+91)(\d{6})(\d{4})/, '$1******$3'),
        expiresIn: 300 // 5 minutes in seconds
      }
    });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP. Please try again.' 
    });
  }
});

// @route   POST /api/otp/verify
// @desc    Verify OTP and login/register user
// @access  Public
router.post('/verify', [
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { phone, otp: inputOTP, name, email } = req.body;

    // Format phone number
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone;
    }
    formattedPhone = '+' + formattedPhone;

    // Find OTP record
    const otpRecord = await OTP.findOne({ 
      phone: formattedPhone,
      isVerified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP not found. Please request a new one.' 
      });
    }

    // Verify OTP
    const verifyResult = otpRecord.verifyOTP(inputOTP);
    await otpRecord.save();

    if (!verifyResult.success) {
      return res.status(400).json({ 
        success: false, 
        message: verifyResult.message,
        attemptsRemaining: otpRecord.maxAttempts - otpRecord.attempts
      });
    }

    // Find or create user
    let user = await User.findOne({ phone: formattedPhone });
    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;
      user = new User({
        name: name || 'User',
        email: email || `user_${Date.now()}@holytravels.com`,
        phone: formattedPhone,
        phoneVerified: true,
        authProvider: 'phone'
      });
      await user.save();

      // Create traveller profile
      const traveller = new Traveller({ user: user._id });
      await traveller.save();
    } else {
      // Update existing user
      user.phoneVerified = true;
      user.lastLogin = new Date();
      await user.save();
    }

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: isNewUser ? 'Registration successful' : 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          phoneVerified: user.phoneVerified,
          isNewUser
        },
        token
      }
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during verification' 
    });
  }
});

// @route   POST /api/otp/resend
// @desc    Resend OTP
// @access  Public
router.post('/resend', [
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('channel').isIn(['sms', 'whatsapp']).withMessage('Channel must be sms or whatsapp')
], async (req, res) => {
  try {
    const { phone, channel } = req.body;

    // Format phone number
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone;
    }
    formattedPhone = '+' + formattedPhone;

    // Check rate limiting (max 3 OTPs per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOTPs = await OTP.countDocuments({
      phone: formattedPhone,
      createdAt: { $gte: oneHourAgo }
    });

    if (recentOTPs >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after 1 hour.'
      });
    }

    // Redirect to send endpoint
    req.body.phone = phone;
    req.body.channel = channel;

    // Delete existing OTPs and create new one
    await OTP.deleteMany({ phone: formattedPhone });

    const otpCode = OTP.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const otp = new OTP({
      phone: formattedPhone,
      otp: otpCode,
      channel,
      expiresAt
    });
    await otp.save();

    const messageBody = `Your Holy Travels verification code is: ${otpCode}. Valid for 5 minutes.`;

    if (channel === 'whatsapp') {
      await twilioClient.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${formattedPhone}`,
        body: messageBody
      });
    } else {
      await twilioClient.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone,
        body: messageBody
      });
    }

    res.json({
      success: true,
      message: `OTP resent via ${channel}`
    });
  } catch (error) {
    console.error('OTP resend error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to resend OTP' 
    });
  }
});

module.exports = router;

