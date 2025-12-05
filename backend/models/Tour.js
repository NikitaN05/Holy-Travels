const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema({
  day: Number,
  title: String,
  description: String,
  activities: [String],
  meals: {
    breakfast: String,
    lunch: String,
    dinner: String
  },
  accommodation: String,
  transportation: String,
  places: [{
    name: String,
    type: { type: String, enum: ['religious', 'historic', 'cultural', 'scenic'] },
    description: String,
    image: String,
    visitDuration: String
  }]
});

const tourSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    hi: String,
    mr: String
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    en: { type: String, required: true },
    hi: String,
    mr: String
  },
  shortDescription: {
    en: String,
    hi: String,
    mr: String
  },

  // allow any category string (no enum)
  category: {
    type: String,
    required: true
  },

  destinations: [{
    name: String,
    type: { type: String, enum: ['religious', 'historic', 'cultural'] },
    description: String,
    image: String
  }],
  images: [{
    url: String,
    caption: String,
    isMain: { type: Boolean, default: false }
  }],
  duration: {
    days: { type: Number, required: true },
    nights: Number
  },
  price: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    discountedAmount: Number,
    includes: [String],
    excludes: [String]
  },
  itinerary: [itineraryItemSchema],
  startDates: [{
    date: Date,
    availableSeats: Number,
    totalSeats: Number,
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' }
  }],
  departureLocation: {
    city: String,
    station: String,
    address: String
  },
  maxGroupSize: {
    type: Number,
    default: 50
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging'],
    default: 'easy'
  },
  highlights: [{
    en: String,
    hi: String,
    mr: String
  }],

  // simple arrays of strings
  inclusions: [String],
  exclusions: [String],

  termsAndConditions: {
    en: String,
    hi: String,
    mr: String
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isActive: {
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

// Generate slug before saving
tourSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for search
tourSchema.index({ 'title.en': 'text', 'description.en': 'text', 'destinations.name': 'text' });

module.exports = mongoose.model('Tour', tourSchema);
