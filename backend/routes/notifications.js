const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;

    const query = {
      isActive: true,
      $or: [
        { targetType: 'all' },
        { targetUsers: req.user._id },
        { targetType: 'tour_group', targetTour: { $in: req.user.currentTours || [] } }
      ]
    };

    if (unreadOnly === 'true') {
      query['readBy.user'] = { $ne: req.user._id };
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Mark read status for each notification
    const notificationsWithReadStatus = notifications.map(n => ({
      ...n.toObject(),
      isRead: n.readBy.some(r => r.user.toString() === req.user._id.toString())
    }));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      ...query,
      'readBy.user': { $ne: req.user._id }
    });

    res.json({
      success: true,
      data: {
        notifications: notificationsWithReadStatus,
        unreadCount,
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

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Check if already read
    const alreadyRead = notification.readBy.some(
      r => r.user.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      notification.readBy.push({ user: req.user._id, readAt: new Date() });
      notification.totalRead += 1;
      await notification.save();
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      isActive: true,
      $or: [
        { targetType: 'all' },
        { targetUsers: req.user._id }
      ],
      'readBy.user': { $ne: req.user._id }
    });

    for (const notification of notifications) {
      notification.readBy.push({ user: req.user._id, readAt: new Date() });
      notification.totalRead += 1;
      await notification.save();
    }

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADMIN ROUTES

// @route   POST /api/notifications
// @desc    Create notification (Admin)
// @access  Private/Admin
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      priority,
      targetType,
      targetUsers,
      targetTour,
      image,
      actionUrl,
      actionType,
      actionData,
      expiresAt
    } = req.body;

    const notification = new Notification({
      title,
      message,
      type,
      priority,
      targetType,
      targetUsers,
      targetTour,
      image,
      actionUrl,
      actionType,
      actionData,
      expiresAt,
      sentAt: new Date(),
      createdBy: req.user._id
    });

    // Calculate total sent
    if (targetType === 'all') {
      notification.totalSent = await User.countDocuments({ isActive: true });
    } else if (targetType === 'specific_users' && targetUsers) {
      notification.totalSent = targetUsers.length;
    }

    await notification.save();

    // Emit socket event
    const io = req.app.get('io');
    if (targetType === 'all') {
      io.emit('new_notification', notification);
    } else if (targetUsers) {
      targetUsers.forEach(userId => {
        io.to(`user_${userId}`).emit('new_notification', notification);
      });
    }

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/notifications/admin/all
// @desc    Get all notifications (Admin)
// @access  Private/Admin
router.get('/admin/all', [auth, isAdmin], async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;

    const query = {};
    if (type) query.type = type;

    const notifications = await Notification.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);

    res.json({
      success: true,
      data: {
        notifications,
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

// @route   DELETE /api/notifications/:id
// @desc    Delete notification (Admin)
// @access  Private/Admin
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

