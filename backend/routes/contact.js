const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { auth, isAdmin } = require('../middleware/auth');

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, subject, message, type, source } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      type: type || 'general',
      source: source || 'website'
    });

    await contact.save();

    // Emit socket event for real-time notification to admin
    const io = req.app.get('io');
    io.emit('new_contact', {
      id: contact._id,
      name: contact.name,
      subject: contact.subject,
      type: contact.type,
      createdAt: contact.createdAt
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        ticketId: contact._id
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/contact/callback
// @desc    Request a callback
// @access  Public
router.post('/callback', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, phone, preferredTime } = req.body;

    const contact = new Contact({
      name,
      phone,
      email: `callback_${Date.now()}@holytravels.com`,
      subject: 'Callback Request',
      message: preferredTime 
        ? `Callback requested. Preferred time: ${preferredTime}` 
        : 'Callback requested',
      type: 'inquiry',
      priority: 'high'
    });

    await contact.save();

    // Notify admin
    const io = req.app.get('io');
    io.emit('callback_request', {
      id: contact._id,
      name,
      phone,
      preferredTime
    });

    res.status(201).json({
      success: true,
      message: 'Callback request received! Our team will call you soon.'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ADMIN ROUTES

// @route   GET /api/contact/admin/all
// @desc    Get all contact requests (Admin)
// @access  Private/Admin
router.get('/admin/all', [auth, isAdmin], async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      type, 
      priority,
      startDate,
      endDate 
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (priority) query.priority = priority;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const contacts = await Contact.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    // Get statistics
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        stats,
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

// @route   PUT /api/contact/admin/:id
// @desc    Update contact request (Admin)
// @access  Private/Admin
router.put('/admin/:id', [auth, isAdmin], async (req, res) => {
  try {
    const { status, priority, assignedTo, adminNotes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (status === 'resolved') updateData.resolvedAt = new Date();

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact request not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact request updated',
      data: contact
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/contact/admin/:id
// @desc    Delete contact request (Admin)
// @access  Private/Admin
router.delete('/admin/:id', [auth, isAdmin], async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Contact request deleted'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;

