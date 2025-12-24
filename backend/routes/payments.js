const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const { auth } = require('../middleware/auth');
const { sendBookingConfirmation } = require('../services/emailService');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', auth, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID and amount are required'
      });
    }

    // Verify booking belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id
    }).populate('tour', 'title');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `booking_${booking.bookingId}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
        tourName: booking.tour.title.en
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        bookingId: booking._id,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify', auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update booking
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'completed',
        paidAmount: req.body.amount || 0,
        transactionId: razorpay_payment_id,
        status: 'confirmed'
      },
      { new: true }
    ).populate('tour', 'title duration')
     .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Send confirmation email
    try {
      await sendBookingConfirmation(booking);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    // Emit socket event
    const io = req.app.get('io');
    io.emit('payment_success', {
      bookingId: booking._id,
      userId: req.user._id
    });

    res.json({
      success: true,
      message: 'Payment verified successfully!',
      data: {
        booking,
        transactionId: razorpay_payment_id
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// @route   POST /api/payments/refund
// @desc    Process refund (Admin)
// @access  Private/Admin
router.post('/refund', auth, async (req, res) => {
  try {
    const { bookingId, amount, reason } = req.body;

    // Check admin role
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (!booking.transactionId) {
      return res.status(400).json({
        success: false,
        message: 'No payment found for this booking'
      });
    }

    // Process refund via Razorpay
    const refund = await razorpay.payments.refund(booking.transactionId, {
      amount: Math.round(amount * 100),
      notes: {
        reason,
        bookingId: booking._id.toString()
      }
    });

    // Update booking
    booking.refundAmount = amount;
    booking.refundStatus = 'processed';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: refund.id,
        amount: amount
      }
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Refund processing failed'
    });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const bookings = await Booking.find({
      user: req.user._id,
      transactionId: { $exists: true, $ne: null }
    })
      .select('bookingId transactionId totalAmount paidAmount paymentStatus createdAt tour')
      .populate('tour', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments({
      user: req.user._id,
      transactionId: { $exists: true, $ne: null }
    });

    res.json({
      success: true,
      data: {
        payments: bookings.map(b => ({
          bookingId: b.bookingId,
          transactionId: b.transactionId,
          tourName: b.tour?.title?.en,
          amount: b.totalAmount,
          paidAmount: b.paidAmount,
          status: b.paymentStatus,
          date: b.createdAt
        })),
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

module.exports = router;

