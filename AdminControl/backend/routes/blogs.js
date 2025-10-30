const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Blog = require('../models/Blog');
const { authenticate, requirePermission, optionalAuthenticate } = require('../middleware/auth');
const { uploadImageFromBase64, deleteImage } = require('../utils/cloudinary');

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all blogs (public with optional admin access)
// @access  Public (with optional admin authentication)
router.get('/', optionalAuthenticate, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['draft', 'published']),
  query('category').optional().isString(),
  query('tag').optional().isString(),
  query('search').optional().isString(),
  query('sort').optional().isIn(['newest', 'oldest', 'most-viewed'])
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Only show published blogs for public access
    if (!req.admin) {
      query.status = 'published';
    } else if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.category) {
      query.categories = req.query.category;
    }

    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Build sort
    let sort = {};
    switch (req.query.sort) {
      case 'oldest':
        sort.createdAt = 1;
        break;
      case 'most-viewed':
        sort.views = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    // Include content if requested (for public frontend previews)
    const selectFields = req.query.includeContent === 'true' ? '' : '-content';
    
    const blogs = await Blog.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(selectFields)
      .populate('createdBy', 'name');

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/blogs/id/:id
// @desc    Get single blog by ID (for admin editing)
// @access  Private (Admin only)
router.get('/id/:id', authenticate, requirePermission('canManageBlogs'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      data: { blog }
    });
  } catch (error) {
    console.error('Get blog by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get single blog by slug
// @access  Public (with optional admin authentication)
router.get('/:slug', optionalAuthenticate, async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('createdBy', 'name');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Only show published blogs to non-admin users
    if (!req.admin && blog.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: { blog }
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/blogs
// @desc    Create new blog
// @access  Private (Admin only)
router.post('/', authenticate, requirePermission('canManageBlogs'), [
  body('title').notEmpty().isLength({ min: 5, max: 200 }),
  body('content').notEmpty().isLength({ min: 50 }),
  body('author').notEmpty().isLength({ max: 100 }),
  body('featuredImage').notEmpty(),
  body('categories').isArray({ min: 1 }),
  body('tags').optional().isArray(),
  body('metaDescription').optional().isLength({ max: 160 }),
  body('metaKeywords').optional().isArray(),
  body('status').optional().isIn(['draft', 'published'])
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

    const {
      title,
      content,
      author,
      featuredImage,
      categories,
      tags = [],
      metaDescription,
      metaKeywords = [],
      status = 'draft'
    } = req.body;

    // Handle featured image
    let imageData;
    if (featuredImage && typeof featuredImage === 'string' && featuredImage.startsWith('data:')) {
      // Base64 image - upload to Cloudinary (backward compatibility)
      // NOTE: For large images, use /api/upload/image endpoint first to avoid 413 errors
      imageData = await uploadImageFromBase64(featuredImage, 'easeandbloom/blogs');
    } else if (typeof featuredImage === 'object' && featuredImage.url) {
      // Already uploaded to Cloudinary - use the provided object
      imageData = featuredImage;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid featured image format'
      });
    }

    const blog = new Blog({
      title,
      content,
      author,
      featuredImage: imageData,
      categories,
      tags,
      metaDescription,
      metaKeywords,
      status,
      createdBy: req.admin._id
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: { blog }
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update blog
// @access  Private (Admin only)
router.put('/:id', authenticate, requirePermission('canManageBlogs'), [
  body('title').optional().isLength({ min: 5, max: 200 }),
  body('content').optional().isLength({ min: 50 }),
  body('author').optional().isLength({ max: 100 }),
  body('categories').optional().isArray({ min: 1 }),
  body('tags').optional().isArray(),
  body('metaDescription').optional().isLength({ max: 160 }),
  body('metaKeywords').optional().isArray(),
  body('status').optional().isIn(['draft', 'published'])
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

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const updateData = { ...req.body };

    // Handle featured image update
    if (req.body.featuredImage) {
      if (typeof req.body.featuredImage === 'string' && req.body.featuredImage.startsWith('data:')) {
        // Base64 image - upload to Cloudinary (backward compatibility)
        // NOTE: For large images, use /api/upload/image endpoint first to avoid 413 errors
        if (blog.featuredImage.publicId) {
          await deleteImage(blog.featuredImage.publicId);
        }
        updateData.featuredImage = await uploadImageFromBase64(req.body.featuredImage, 'easeandbloom/blogs');
      } else if (typeof req.body.featuredImage === 'object' && req.body.featuredImage.url) {
        // Already uploaded to Cloudinary - delete old and use new
        if (blog.featuredImage.publicId && blog.featuredImage.publicId !== req.body.featuredImage.publicId) {
          await deleteImage(blog.featuredImage.publicId);
        }
        updateData.featuredImage = req.body.featuredImage;
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: { blog: updatedBlog }
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete blog
// @access  Private (Admin only)
router.delete('/:id', authenticate, requirePermission('canManageBlogs'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Delete featured image from Cloudinary
    if (blog.featuredImage.publicId) {
      await deleteImage(blog.featuredImage.publicId);
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
