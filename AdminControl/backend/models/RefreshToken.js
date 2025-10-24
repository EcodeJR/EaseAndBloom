const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    select: false // Don't include token in queries by default
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index
  }
}, {
  timestamps: true
});

// Hash token before saving
refreshTokenSchema.pre('save', async function(next) {
  if (!this.isModified('token')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.token = await bcrypt.hash(this.token, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare token method
refreshTokenSchema.methods.compareToken = async function(candidateToken) {
  return await bcrypt.compare(candidateToken, this.token);
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
