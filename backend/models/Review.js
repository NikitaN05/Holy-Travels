const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  
  // Ratings (1-5)
  ratings: {
    overall: { type: Number, required: true, min: 1, max: 5 },
    accommodation: { type: Number, min: 1, max: 5 },
    food: { type: Number, min: 1, max: 5 },
    transportation: { type: Number, min: 1, max: 5 },
    guide: { type: Number, min: 1, max: 5 },
    valueForMoney: { type: Number, min: 1, max: 5 },
    hospitality: { type: Number, min: 1, max: 5 }
  },
  
  // Review content
  title: String,
  review: {
    type: String,
    required: true
  },
  
  // Highlights
  highlights: [String],
  improvements: [String],
  
  // Media
  photos: [{
    url: String,
    caption: String
  }],
  
  // Travel details
  travelDate: Date,
  travellerType: {
    type: String,
    enum: ['solo', 'couple', 'family', 'friends', 'group']
  },
  
  // Moderation
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  moderationNotes: String,
  
  // Engagement
  helpfulCount: {
    type: Number,
    default: 0
  },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Admin response
  adminResponse: {
    response: String,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    respondedAt: Date
  },
  
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure one review per user per tour
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

// Update tour average rating after save
reviewSchema.post('save', async function() {
  const Tour = mongoose.model('Tour');
  const reviews = await this.constructor.find({ tour: this.tour, status: 'approved' });
  
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.ratings.overall, 0) / reviews.length;
    await Tour.findByIdAndUpdate(this.tour, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);

