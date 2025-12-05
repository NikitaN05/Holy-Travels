const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  thumbnail: String,
  caption: {
    en: String,
    hi: String,
    mr: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [String],
  takenAt: Date,
  location: String
}, {
  timestamps: true
});

const albumSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    hi: String,
    mr: String
  },
  description: {
    en: String,
    hi: String,
    mr: String
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  },
  tourDate: Date,
  coverImage: String,
  photos: [photoSchema],
  
  // Organization
  category: {
    type: String,
    enum: ['pilgrimage', 'historic', 'cultural', 'food', 'group', 'scenic', 'events'],
    default: 'group'
  },
  
  // Day-wise organization
  dayNumber: Number,
  
  // Stats
  totalPhotos: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Update photo count
albumSchema.pre('save', function(next) {
  this.totalPhotos = this.photos.length;
  next();
});

module.exports = mongoose.model('Gallery', albumSchema);

