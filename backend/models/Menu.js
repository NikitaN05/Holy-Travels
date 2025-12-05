const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    en: String,
    hi: String,
    mr: String
  },
  description: {
    en: String,
    hi: String,
    mr: String
  },
  type: {
    type: String,
    enum: ['veg', 'non-veg', 'vegan', 'jain']
  },
  image: String,
  isAvailable: { type: Boolean, default: true }
});

const menuSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  },
  
  breakfast: {
    timing: {
      start: String,
      end: String
    },
    items: [menuItemSchema],
    specialNotes: {
      en: String,
      hi: String,
      mr: String
    }
  },
  
  lunch: {
    timing: {
      start: String,
      end: String
    },
    items: [menuItemSchema],
    specialNotes: {
      en: String,
      hi: String,
      mr: String
    }
  },
  
  dinner: {
    timing: {
      start: String,
      end: String
    },
    items: [menuItemSchema],
    specialNotes: {
      en: String,
      hi: String,
      mr: String
    }
  },
  
  snacks: {
    timing: {
      start: String,
      end: String
    },
    items: [menuItemSchema]
  },
  
  timings: {
    breakfast: String,
    lunch: String,
    dinner: String,
    snacks: String
  },
  
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

// Ensure one menu per date per tour
menuSchema.index({ date: 1, tour: 1 }, { unique: true });

module.exports = mongoose.model('Menu', menuSchema);

