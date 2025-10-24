const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Story = require('../models/Story');
const Admin = require('../models/Admin');
const { authenticate, requirePermission } = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../utils/email');
const { createStorySubmissionNotification, createStoryApprovalNotification } = require('../utils/notifications');

const router = express.Router();

// @route   GET /api/stories
// @desc    Get all stories (public - only published)
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isString(),
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
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    // Build query - only show published stories for public access
    let query = { status: 'published' };

    if (req.query.category) {
      query.category = req.query.category;
    }

    // Build sort
    let sort = {};
    switch (req.query.sort) {
      case 'oldest':
        sort.publishedAt = 1;
        break;
      case 'most-viewed':
        sort.views = -1;
        break;
      default:
        sort.publishedAt = -1;
    }

    const stories = await Story.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-content') // Don't include full content in list
      .populate('reviewedBy', 'name');

    const total = await Story.countDocuments(query);

    res.json({
      success: true,
      data: {
        stories,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/stories/:id
// @desc    Get single story by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('reviewedBy', 'name');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Only show published stories to non-admin users
    if (!req.admin && story.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Increment view count
    story.views += 1;
    await story.save();

    res.json({
      success: true,
      data: { story }
    });
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/stories
// @desc    Submit new story
// @access  Public
router.post('/', [
  body('title').notEmpty().isLength({ min: 5, max: 200 }),
  body('content').notEmpty().isLength({ min: 50, max: 5000 }),
  body('submitterName').optional().isLength({ max: 100 }),
  body('submitterEmail').optional().isEmail(),
  body('category').notEmpty().isIn([
    'Recovery Journey',
    'Coping Strategies',
    'Personal Experience',
    'Hope & Healing',
    'Support & Resources',
    'Mental Health Awareness',
    'Therapy Experience',
    'Self-Discovery',
    'Overcoming Challenges',
    'Inspiration'
  ])
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
      submitterName = 'Anonymous',
      submitterEmail,
      category
    } = req.body;

    const story = new Story({
      title,
      content,
      submitterName,
      submitterEmail,
      category
    });

    await story.save();

    // Create in-app notification for admins
    try {
      await createStorySubmissionNotification(story);
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
      // Don't fail the story submission if notification fails
    }

    // Send notification email to admins
    try {
      const admins = await Admin.find({ isActive: true });
      const emailTemplate = emailTemplates.newStorySubmission(story);
      
      for (const admin of admins) {
        await sendEmail(admin.email, emailTemplate.subject, emailTemplate.html);
      }
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the story submission if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Story submitted successfully. It will be reviewed before publishing.',
      data: { storyId: story._id }
    });
  } catch (error) {
    console.error('Submit story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/stories/admin/all
// @desc    Get all stories for admin (with all statuses)
// @access  Private (Admin only)
router.get('/admin/all', authenticate, requirePermission('canManageStories'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['pending', 'approved', 'published', 'rejected']),
  query('category').optional().isString(),
  query('search').optional().isString()
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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
        { submitterName: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const stories = await Story.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('reviewedBy', 'name');

    const total = await Story.countDocuments(query);

    res.json({
      success: true,
      data: {
        stories,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get admin stories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/stories/:id/approve
// @desc    Approve story
// @access  Private (Admin only)
router.put('/:id/approve', authenticate, requirePermission('canManageStories'), async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    story.status = 'approved';
    story.reviewedBy = req.admin._id;
    await story.save();

    res.json({
      success: true,
      message: 'Story approved successfully',
      data: { story }
    });
  } catch (error) {
    console.error('Approve story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/stories/:id/publish
// @desc    Publish story
// @access  Private (Admin only)
router.put('/:id/publish', authenticate, requirePermission('canManageStories'), async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    story.status = 'published';
    story.reviewedBy = req.admin._id;
    await story.save();

    // Create in-app notification
    try {
      await createStoryApprovalNotification(story);
    } catch (notificationError) {
      console.error('Failed to create approval notification:', notificationError);
      // Don't fail the publish action if notification fails
    }

    // Send notification email to submitter if email provided
    if (story.submitterEmail) {
      try {
        const emailTemplate = emailTemplates.storyApproved(story);
        await sendEmail(story.submitterEmail, emailTemplate.subject, emailTemplate.html);
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        // Don't fail the publish action if email fails
      }
    }

    res.json({
      success: true,
      message: 'Story published successfully',
      data: { story }
    });
  } catch (error) {
    console.error('Publish story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/stories/:id/reject
// @desc    Reject story
// @access  Private (Admin only)
router.put('/:id/reject', authenticate, requirePermission('canManageStories'), [
  body('rejectionReason').optional().isLength({ max: 500 })
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

    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    story.status = 'rejected';
    story.rejectionReason = req.body.rejectionReason || '';
    story.reviewedBy = req.admin._id;
    await story.save();

    // Send notification email to submitter if email provided
    if (story.submitterEmail) {
      try {
        const emailTemplate = emailTemplates.storyRejected(story);
        await sendEmail(story.submitterEmail, emailTemplate.subject, emailTemplate.html);
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
        // Don't fail the reject action if email fails
      }
    }

    res.json({
      success: true,
      message: 'Story rejected successfully',
      data: { story }
    });
  } catch (error) {
    console.error('Reject story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/stories/:id
// @desc    Update story
// @access  Private (Admin only)
router.put('/:id', authenticate, requirePermission('canManageStories'), [
  body('title').optional().isLength({ min: 5, max: 200 }),
  body('content').optional().isLength({ min: 50, max: 5000 }),
  body('submitterName').optional().isLength({ max: 100 }),
  body('category').optional().isIn([
    'Recovery Journey',
    'Coping Strategies',
    'Personal Experience',
    'Hope & Healing',
    'Support & Resources',
    'Mental Health Awareness',
    'Therapy Experience',
    'Self-Discovery',
    'Overcoming Challenges',
    'Inspiration'
  ])
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

    const story = await Story.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    res.json({
      success: true,
      message: 'Story updated successfully',
      data: { story }
    });
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/stories/:id
// @desc    Delete story
// @access  Private (Admin only)
router.delete('/:id', authenticate, requirePermission('canManageStories'), async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    res.json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
