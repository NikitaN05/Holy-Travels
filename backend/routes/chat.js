const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ChatMessage = require('../models/ChatMessage');
const Conversation = require('../models/Conversation');
const { auth, isAdmin } = require('../middleware/auth');

// @route   POST /api/chat/conversation
// @desc    Create or get existing conversation
// @access  Private
router.post('/conversation', auth, async (req, res) => {
  try {
    const { subject, category } = req.body;

    // Check for existing active conversation
    let conversation = await Conversation.findOne({
      user: req.user._id,
      status: { $in: ['active', 'pending'] }
    });

    if (!conversation) {
      conversation = new Conversation({
        user: req.user._id,
        subject: subject || 'General Inquiry',
        category: category || 'general'
      });
      await conversation.save();
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/chat/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/chat/messages/:conversationId
// @desc    Get messages for a conversation
// @access  Private
router.get('/messages/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user owns conversation
    const conversation = await Conversation.findOne({
      conversationId,
      $or: [
        { user: req.user._id },
        ...(req.user.role === 'admin' || req.user.role === 'super_admin' ? [{}] : [])
      ]
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const messages = await ChatMessage.find({ conversationId })
      .populate('sender', 'name profileImage role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Mark messages as read
    await ChatMessage.updateMany(
      {
        conversationId,
        sender: { $ne: req.user._id },
        isRead: false
      },
      { isRead: true, readAt: new Date() }
    );

    // Update unread count
    if (req.user.role === 'admin' || req.user.role === 'super_admin') {
      conversation.unreadCount.admin = 0;
    } else {
      conversation.unreadCount.user = 0;
    }
    await conversation.save();

    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        conversation
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/chat/messages
// @desc    Send a message
// @access  Private
router.post('/messages', [
  auth,
  body('conversationId').notEmpty().withMessage('Conversation ID is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { conversationId, message, messageType, attachments, metadata } = req.body;

    // Verify conversation exists
    const conversation = await Conversation.findOne({ conversationId });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Determine sender type
    const senderType = req.user.role === 'admin' || req.user.role === 'super_admin' 
      ? 'admin' 
      : 'user';

    // Create message
    const chatMessage = new ChatMessage({
      conversationId,
      sender: req.user._id,
      senderType,
      message,
      messageType: messageType || 'text',
      attachments,
      metadata
    });

    await chatMessage.save();

    // Update conversation
    conversation.lastMessage = {
      text: message,
      sender: req.user._id,
      timestamp: new Date()
    };

    // Update unread counts
    if (senderType === 'admin') {
      conversation.unreadCount.user += 1;
    } else {
      conversation.unreadCount.admin += 1;
    }

    if (conversation.status === 'pending') {
      conversation.status = 'active';
    }

    await conversation.save();

    // Populate sender info
    await chatMessage.populate('sender', 'name profileImage role');

    // Emit socket event for real-time messaging
    const io = req.app.get('io');
    io.to(`chat_${conversationId}`).emit('new_message', {
      message: chatMessage,
      conversationId
    });

    // Notify other party
    if (senderType === 'user') {
      io.emit('admin_new_message', {
        conversationId,
        userId: conversation.user,
        message: chatMessage
      });
    } else {
      io.to(`user_${conversation.user}`).emit('user_new_message', {
        conversationId,
        message: chatMessage
      });
    }

    res.status(201).json({
      success: true,
      data: chatMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/chat/conversation/:conversationId/close
// @desc    Close a conversation
// @access  Private
router.put('/conversation/:conversationId/close', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { rating, feedback } = req.body;

    const conversation = await Conversation.findOneAndUpdate(
      { conversationId },
      {
        status: 'closed',
        closedAt: new Date(),
        closedBy: req.user._id,
        ...(rating && {
          rating: {
            score: rating,
            feedback,
            ratedAt: new Date()
          }
        })
      },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      message: 'Conversation closed',
      data: conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ADMIN ROUTES

// @route   GET /api/chat/admin/conversations
// @desc    Get all conversations (Admin)
// @access  Private/Admin
router.get('/admin/conversations', [auth, isAdmin], async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const conversations = await Conversation.find(query)
      .populate('user', 'name email phone profileImage')
      .populate('assignedAdmin', 'name')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Conversation.countDocuments(query);

    // Get stats
    const stats = {
      active: await Conversation.countDocuments({ status: 'active' }),
      pending: await Conversation.countDocuments({ status: 'pending' }),
      resolved: await Conversation.countDocuments({ status: 'resolved' }),
      closed: await Conversation.countDocuments({ status: 'closed' })
    };

    res.json({
      success: true,
      data: {
        conversations,
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

// @route   PUT /api/chat/admin/conversation/:conversationId/assign
// @desc    Assign conversation to admin
// @access  Private/Admin
router.put('/admin/conversation/:conversationId/assign', [auth, isAdmin], async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { adminId } = req.body;

    const conversation = await Conversation.findOneAndUpdate(
      { conversationId },
      { assignedAdmin: adminId || req.user._id },
      { new: true }
    ).populate('assignedAdmin', 'name');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      message: 'Conversation assigned',
      data: conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

