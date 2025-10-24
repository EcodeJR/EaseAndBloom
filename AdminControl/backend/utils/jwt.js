const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const RefreshToken = require('../models/RefreshToken');

// Generate access token
const generateAccessToken = (adminId) => {
  return jwt.sign(
    { adminId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '5h' }
  );
};

// Generate refresh token
const generateRefreshToken = () => {
  return jwt.sign(
    { type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify access token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Store refresh token in database
const storeRefreshToken = async (adminId, token) => {
  try {
    // Remove any existing refresh tokens for this admin
    await RefreshToken.deleteMany({ adminId });
    
    // Create new refresh token
    const refreshToken = new RefreshToken({
      token,
      adminId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    
    await refreshToken.save();
    return refreshToken;
  } catch (error) {
    throw new Error('Failed to store refresh token');
  }
};

// Remove refresh token from database
const removeRefreshToken = async (token) => {
  try {
    await RefreshToken.deleteOne({ token });
  } catch (error) {
    throw new Error('Failed to remove refresh token');
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  storeRefreshToken,
  removeRefreshToken
};
