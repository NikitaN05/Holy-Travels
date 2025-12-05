const mongoose = require('mongoose');

const travelHistorySchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  startDate: Date,
  endDate: Date,
  destinations: [String],
  rating: Number,
  feedback: String,
  photos: [String]
});

const travellerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Travel details
  ticketNumber: String,
  platformNumber: String,
  railwayStation: String,
  seatNumber: String,
  coachNumber: String,
  
  // Hotel details
  hotelName: String,
  hotelAddress: String,
  roomNumber: String,
  checkInDate: Date,
  checkOutDate: Date,
  
  // Emergency contacts
  emergencyContacts: [{
    name: String,
    relation: String,
    phone: String
  }],
  
  // Medical info
  medicalConditions: [String],
  bloodGroup: String,
  allergies: [String],
  
  // Travel history
  totalTrips: {
    type: Number,
    default: 0
  },
  travelHistory: [travelHistorySchema],
  
  // Preferences
  dietaryPreferences: {
    type: String,
    enum: ['veg', 'non-veg', 'vegan', 'jain'],
    default: 'veg'
  },
  mealPreferences: [String],
  specialRequirements: String,
  
  // Loyalty
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  membershipTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  
  // Current tour
  currentTour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  },
  currentBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }
}, {
  timestamps: true
});

// Update total trips count
travellerSchema.methods.updateTripCount = async function() {
  this.totalTrips = this.travelHistory.length;
  await this.save();
};

// Add travel to history
travellerSchema.methods.addTravelHistory = async function(travelData) {
  this.travelHistory.push(travelData);
  this.totalTrips = this.travelHistory.length;
  
  // Update loyalty tier
  if (this.totalTrips >= 20) this.membershipTier = 'platinum';
  else if (this.totalTrips >= 10) this.membershipTier = 'gold';
  else if (this.totalTrips >= 5) this.membershipTier = 'silver';
  
  await this.save();
};

module.exports = mongoose.model('Traveller', travellerSchema);

