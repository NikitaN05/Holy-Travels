const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String },
    city: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    // add more fields later if needed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);
