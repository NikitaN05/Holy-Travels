const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    lowercase: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['login', 'register', 'reset_password', 'verify_phone'],
    default: 'login'
  },
  channel: {
    type: String,
    enum: ['sms', 'whatsapp', 'email'],
    default: 'sms'
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 3
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Verify OTP
otpSchema.methods.verifyOTP = function(inputOTP) {
  if (this.attempts >= this.maxAttempts) {
    return { success: false, message: 'Maximum attempts exceeded' };
  }
  
  if (new Date() > this.expiresAt) {
    return { success: false, message: 'OTP has expired' };
  }
  
  if (this.otp !== inputOTP) {
    this.attempts += 1;
    return { success: false, message: 'Invalid OTP' };
  }
  
  this.isVerified = true;
  return { success: true, message: 'OTP verified successfully' };
};

module.exports = mongoose.model('OTP', otpSchema);

