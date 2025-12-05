const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const Traveller = require('../models/Traveller');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// Twilio setup (placeholder)
const sendSMS = async (to, message) => {
  console.log(`SMS to ${to}: ${message}`);
  // Implement Twilio SMS here
  return { success: true, sid: 'placeholder' };
};

const sendWhatsApp = async (to, message) => {
  console.log(`WhatsApp to ${to}: ${message}`);
  // Implement WhatsApp here
  return { success: true };
};

// @route   POST /api/emergency/trigger
// @desc    Trigger emergency alert
// @access  Private
router.post('/trigger', auth, async (req, res) => {
  try {
    const { type = 'sos', description, location } = req.body;

    const traveller = await Traveller.findOne({ user: req.user._id })
      .populate('currentTour')
      .populate('currentBooking');

    const emergency = new Emergency({
      user: req.user._id,
      traveller: traveller?._id,
      tour: traveller?.currentTour?._id,
      booking: traveller?.currentBooking?._id,
      type,
      severity: type === 'sos' ? 'critical' : 'high',
      description,
      location
    });

    await emergency.save();

    // Get admin users
    const admins = await User.find({ role: { $in: ['admin', 'super_admin'] }, isActive: true });

    // Emit socket event for real-time alert
    const io = req.app.get('io');
    io.emit('emergency_alert', {
      emergencyId: emergency._id,
      user: { id: req.user._id, name: req.user.name, phone: req.user.phone },
      type,
      severity: emergency.severity,
      location,
      timestamp: emergency.createdAt
    });

    // Send SMS/WhatsApp to admins (placeholder)
    for (const admin of admins) {
      const smsResult = await sendSMS(
        admin.phone,
        `🚨 EMERGENCY ALERT!\nTraveller: ${req.user.name}\nType: ${type}\nLocation: ${location?.address || 'Unknown'}\nTime: ${new Date().toLocaleString()}`
      );
      
      emergency.communications.push({
        type: 'sms',
        to: admin.phone,
        message: 'Emergency alert sent',
        status: smsResult.success ? 'sent' : 'failed',
        timestamp: new Date()
      });
    }

    // Send to traveller's emergency contacts
    if (traveller?.emergencyContacts) {
      for (const contact of traveller.emergencyContacts) {
        await sendSMS(
          contact.phone,
          `🚨 Emergency Alert: ${req.user.name} has triggered an emergency alert during their travel. Please contact Holy Travels support immediately.`
        );
        
        emergency.communications.push({
          type: 'sms',
          to: contact.phone,
          message: 'Emergency contact notified',
          status: 'sent',
          timestamp: new Date()
        });
      }
    }

    await emergency.save();

    res.status(201).json({
      success: true,
      message: 'Emergency alert triggered successfully',
      data: {
        emergencyId: emergency._id,
        status: emergency.status
      }
    });
  } catch (error) {
    console.error('Emergency trigger error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/emergency/my-alerts
// @desc    Get user's emergency alerts
// @access  Private
router.get('/my-alerts', auth, async (req, res) => {
  try {
    const alerts = await Emergency.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/emergency/:id/cancel
// @desc    Cancel emergency (false alarm)
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const emergency = await Emergency.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!emergency) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }

    if (emergency.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Cannot cancel this alert' });
    }

    emergency.status = 'false_alarm';
    emergency.resolvedAt = new Date();
    emergency.resolution = 'Cancelled by user - False alarm';
    await emergency.save();

    const io = req.app.get('io');
    io.emit('emergency_cancelled', { emergencyId: emergency._id });

    res.json({
      success: true,
      message: 'Emergency cancelled'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADMIN ROUTES

// @route   GET /api/emergency/active
// @desc    Get active emergencies (Admin)
// @access  Private/Admin
router.get('/active', [auth, isAdmin], async (req, res) => {
  try {
    const emergencies = await Emergency.find({
      status: { $in: ['active', 'acknowledged', 'responding'] }
    })
      .populate('user', 'name phone email')
      .populate('tour', 'title')
      .sort({ severity: -1, createdAt: -1 });

    res.json({ success: true, data: emergencies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/emergency/all
// @desc    Get all emergencies (Admin)
// @access  Private/Admin
router.get('/all', [auth, isAdmin], async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const emergencies = await Emergency.find(query)
      .populate('user', 'name phone')
      .populate('tour', 'title')
      .populate('acknowledgedBy', 'name')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Emergency.countDocuments(query);

    res.json({
      success: true,
      data: {
        emergencies,
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

// @route   PUT /api/emergency/:id/acknowledge
// @desc    Acknowledge emergency (Admin)
// @access  Private/Admin
router.put('/:id/acknowledge', [auth, isAdmin], async (req, res) => {
  try {
    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      {
        status: 'acknowledged',
        acknowledgedBy: req.user._id,
        acknowledgedAt: new Date()
      },
      { new: true }
    ).populate('user', 'name phone');

    if (!emergency) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }

    const io = req.app.get('io');
    io.emit('emergency_acknowledged', { 
      emergencyId: emergency._id,
      acknowledgedBy: req.user.name 
    });

    res.json({
      success: true,
      message: 'Emergency acknowledged',
      data: emergency
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/emergency/:id/resolve
// @desc    Resolve emergency (Admin)
// @access  Private/Admin
router.put('/:id/resolve', [auth, isAdmin], async (req, res) => {
  try {
    const { resolution } = req.body;

    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      {
        status: 'resolved',
        resolvedBy: req.user._id,
        resolvedAt: new Date(),
        resolution
      },
      { new: true }
    );

    if (!emergency) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }

    const io = req.app.get('io');
    io.emit('emergency_resolved', { emergencyId: emergency._id });

    res.json({
      success: true,
      message: 'Emergency resolved',
      data: emergency
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

