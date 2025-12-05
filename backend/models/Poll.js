const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  destination: {
    name: {
      en: String,
      hi: String,
      mr: String
    },
    image: String,
    description: {
      en: String,
      hi: String,
      mr: String
    }
  },
  votes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    votedAt: { type: Date, default: Date.now }
  }],
  voteCount: {
    type: Number,
    default: 0
  }
});

const pollSchema = new mongoose.Schema({
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
  question: {
    en: { type: String, required: true },
    hi: String,
    mr: String
  },
  options: [optionSchema],
  
  // Poll settings
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  allowMultipleVotes: {
    type: Boolean,
    default: false
  },
  showResultsBeforeEnd: {
    type: Boolean,
    default: false
  },
  
  // Stats
  totalVotes: {
    type: Number,
    default: 0
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Winner (set after poll ends)
  winner: {
    optionIndex: Number,
    destination: String,
    totalVotes: Number
  },
  
  status: {
    type: String,
    enum: ['draft', 'active', 'ended', 'cancelled'],
    default: 'draft'
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

// Update vote count
pollSchema.methods.updateVoteCounts = function() {
  this.options.forEach(option => {
    option.voteCount = option.votes.length;
  });
  this.totalVotes = this.options.reduce((sum, opt) => sum + opt.voteCount, 0);
};

// Determine winner
pollSchema.methods.determineWinner = function() {
  if (this.options.length === 0) return null;
  
  let maxVotes = 0;
  let winnerIndex = 0;
  
  this.options.forEach((option, index) => {
    if (option.voteCount > maxVotes) {
      maxVotes = option.voteCount;
      winnerIndex = index;
    }
  });
  
  this.winner = {
    optionIndex: winnerIndex,
    destination: this.options[winnerIndex].destination.name.en,
    totalVotes: maxVotes
  };
  
  return this.winner;
};

module.exports = mongoose.model('Poll', pollSchema);

