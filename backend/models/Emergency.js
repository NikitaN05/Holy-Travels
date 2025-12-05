const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  traveller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Traveller'
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  
  // Alert details
  type: {
    type: String,
    enum: ['medical', 'safety', 'lost', 'general', 'sos'],
    default: 'sos'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high'
  },
  description: String,
  
  // Location
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    landmark: String
  },
  
  // Response tracking
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'responding', 'resolved', 'false_alarm'],
    default: 'active'
  },
  acknowledgedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acknowledgedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  resolution: String,
  
  // Communication log
  communications: [{
    type: { type: String, enum: ['sms', 'whatsapp', 'call', 'app'] },
    to: String,
    message: String,
    status: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Response team
  responders: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    notifiedAt: Date,
    respondedAt: Date
  }]
}, {
  timestamps: true
});

// Index for quick lookup
emergencySchema.index({ status: 1, severity: 1, createdAt: -1 });

module.exports = mongoose.model('Emergency', emergencySchema);

