const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    hi: String,
    mr: String
  },
  message: {
    en: { type: String, required: true },
    hi: String,
    mr: String
  },
  type: {
    type: String,
    enum: ['tour', 'menu', 'poll', 'emergency', 'general', 'promotion', 'reminder'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Target audience
  targetType: {
    type: String,
    enum: ['all', 'specific_users', 'tour_group', 'admins'],
    default: 'all'
  },
  targetUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  targetTour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  },
  
  // Content
  image: String,
  actionUrl: String,
  actionType: {
    type: String,
    enum: ['none', 'open_tour', 'open_poll', 'open_menu', 'open_gallery', 'external_link'],
    default: 'none'
  },
  actionData: mongoose.Schema.Types.Mixed,
  
  // Tracking
  sentAt: Date,
  expiresAt: Date,
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: Date
  }],
  
  // Stats
  totalSent: { type: Number, default: 0 },
  totalRead: { type: Number, default: 0 },
  
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ type: 1, isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

