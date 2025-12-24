const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  ageCategory: { 
    type: String, 
    enum: ['adult', 'child', 'infant', 'senior'],
    default: 'adult'
  },
  aadharNumber: String,
  phone: String,
  price: Number // Individual passenger price based on age category
});

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  tourDate: {
    type: Date,
    required: true
  },
  passengers: [passengerSchema],
  totalPassengers: {
    type: Number,
    required: true
  },
  
  // Pricing
  basePrice: Number,
  discount: {
    type: Number,
    default: 0
  },
  taxes: Number,
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cash'],
  },
  transactionId: String,
  
  // Travel details
  ticketDetails: {
    ticketNumber: String,
    pnr: String,
    trainNumber: String,
    trainName: String,
    coach: String,
    seatNumbers: [String],
    departureStation: String,
    arrivalStation: String,
    departureTime: Date,
    arrivalTime: Date,
    platform: String
  },
  
  // Hotel details
  hotelDetails: {
    hotelName: String,
    address: String,
    roomNumbers: [String],
    roomType: String,
    checkIn: Date,
    checkOut: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'pending'
  },
  
  // Notes
  specialRequests: String,
  adminNotes: String,
  
  // Cancellation
  cancellationReason: String,
  cancelledAt: Date,
  refundAmount: Number,
  refundStatus: {
    type: String,
    enum: ['pending', 'processed', 'completed'],
  }
}, {
  timestamps: true
});

// Generate booking ID before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.bookingId = `HT${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

