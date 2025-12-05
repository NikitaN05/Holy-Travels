const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const { auth, isAdmin } = require('../middleware/auth');

// @route   GET /api/menu/today
// @desc    Get today's menu
// @access  Public
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let menu = await Menu.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      },
      isActive: true
    });

    if (!menu) {
      return res.json({
        success: true,
        data: null,
        message: 'No menu available for today'
      });
    }

    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/menu/week
// @desc    Get week's menu
// @access  Public
router.get('/week', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const menus = await Menu.find({
      date: { $gte: today, $lt: weekEnd },
      isActive: true
    }).sort({ date: 1 });

    res.json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/menu/:date
// @desc    Get menu for specific date
// @access  Public
router.get('/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const menu = await Menu.findOne({
      date: {
        $gte: date,
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
      },
      isActive: true
    });

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'No menu found for this date'
      });
    }

    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/menu/tour/:tourId
// @desc    Get menu for specific tour
// @access  Private
router.get('/tour/:tourId', auth, async (req, res) => {
  try {
    const menus = await Menu.find({
      tour: req.params.tourId,
      isActive: true
    }).sort({ date: 1 });

    res.json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ADMIN ROUTES

// @route   POST /api/menu
// @desc    Create menu (Admin)
// @access  Private/Admin
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const {
      date,
      tour,
      breakfast,
      lunch,
      dinner,
      snacks,
      timings
    } = req.body;

    // Check if menu already exists for this date
    const existingMenu = await Menu.findOne({
      date: new Date(date),
      tour: tour || null
    });

    if (existingMenu) {
      return res.status(400).json({
        success: false,
        message: 'Menu already exists for this date. Please update instead.'
      });
    }

    const menu = new Menu({
      date: new Date(date),
      tour,
      breakfast,
      lunch,
      dinner,
      snacks,
      timings,
      createdBy: req.user._id
    });

    await menu.save();

    // Send notification
    const io = req.app.get('io');
    io.emit('menu_updated', { date: menu.date, menu });

    res.status(201).json({
      success: true,
      message: 'Menu created successfully',
      data: menu
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update menu (Admin)
// @access  Private/Admin
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu not found' });
    }

    // Send notification
    const io = req.app.get('io');
    io.emit('menu_updated', { date: menu.date, menu });

    res.json({
      success: true,
      message: 'Menu updated successfully',
      data: menu
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu (Admin)
// @access  Private/Admin
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    await Menu.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Menu deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/menu/admin/all
// @desc    Get all menus (Admin)
// @access  Private/Admin
router.get('/admin/all', [auth, isAdmin], async (req, res) => {
  try {
    const { page = 1, limit = 20, tour, startDate, endDate } = req.query;

    const query = { isActive: true };
    if (tour) query.tour = tour;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const menus = await Menu.find(query)
      .populate('tour', 'title')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Menu.countDocuments(query);

    res.json({
      success: true,
      data: {
        menus,
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

module.exports = router;

