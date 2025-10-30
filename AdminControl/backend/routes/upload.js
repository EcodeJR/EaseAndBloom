const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate, requirePermission } = require('../middleware/auth');
const { uploadImageFromBase64 } = require('../utils/cloudinary');

const router = express.Router();

// @route   POST /api/upload/image
// @desc    Upload image to Cloudinary
// @access  Private (Admin only)
router.post('/image', authenticate, requirePermission('canManageBlogs'), [
  body('image').notEmpty().withMessage('Image data is required'),
  body('folder').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { image, folder = 'easeandbloom/blogs' } = req.body;

    // Validate base64 format
    if (!image.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Must be base64 encoded image.'
      });
    }

    // Upload to Cloudinary
    const imageData = await uploadImageFromBase64(image, folder);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: { image: imageData }
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image'
    });
  }
});

module.exports = router;
