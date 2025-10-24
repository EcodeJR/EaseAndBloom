const express = require('express');
const { body, validationResult } = require('express-validator');
const Waitlist = require('../models/Waitlist');
const { sendEmail } = require('../utils/email');
const { authenticate: auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/waitlist
// @desc    Add user to waitlist
// @access  Public
router.post('/', [
  body('firstName').trim().isLength({ min: 1, max: 50 }).withMessage('First name is required and must be less than 50 characters'),
  body('lastName').trim().isLength({ min: 1, max: 50 }).withMessage('Last name is required and must be less than 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email
    } = req.body;

    // Check if email already exists
    const existingUser = await Waitlist.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered for waitlist'
      });
    }

    // Create waitlist entry
    const waitlistEntry = new Waitlist({
      firstName,
      lastName,
      email,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    await waitlistEntry.save();

    // Send confirmation email to user
    try {
      await sendEmail(
        email,
        'Welcome to Ease & Bloom Waitlist!',
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Welcome to Ease & Bloom!</h2>
            <p>Hi ${firstName},</p>
            <p>Thank you for joining our waitlist! We're excited to have you on board.</p>
            <p>We'll notify you as soon as our platform is ready for you to explore.</p>
            <p>Best regards,<br>The Ease & Bloom Team</p>
          </div>
        `
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Successfully added to waitlist',
      data: {
        id: waitlistEntry._id,
        email: waitlistEntry.email,
        fullName: waitlistEntry.fullName
      }
    });

  } catch (error) {
    console.error('Waitlist registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   GET /api/waitlist
// @desc    Get all waitlist entries
// @access  Private (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const waitlistEntries = await Waitlist.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-ipAddress -userAgent');

    const total = await Waitlist.countDocuments(query);

    res.json({
      success: true,
      data: {
        docs: waitlistEntries,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        totalDocs: total,
        hasNextPage: parseInt(page) < Math.ceil(total / limit),
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get waitlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/waitlist/stats
// @desc    Get waitlist statistics
// @access  Private (Admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Waitlist.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          notified: { $sum: { $cond: [{ $eq: ['$status', 'notified'] }, 1, 0] } },
          converted: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } }
        }
      }
    ]);

    const monthlyStats = await Waitlist.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    const overview = stats[0] || { total: 0, pending: 0, notified: 0, converted: 0 };
    res.json({
      success: true,
      data: {
        total: overview.total,
        pending: overview.pending,
        notified: overview.notified,
        converted: overview.converted,
        monthly: monthlyStats
      }
    });

  } catch (error) {
    console.error('Get waitlist stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/waitlist/send-notification
// @desc    Send notification emails to waitlist users
// @access  Private (Admin only)
router.post('/send-notification', auth, [
  body('recipients').isArray().withMessage('Recipients must be an array'),
  body('subject').trim().isLength({ min: 1, max: 200 }).withMessage('Subject is required'),
  body('htmlContent').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('template').optional().isIn(['basic', 'custom']).withMessage('Invalid template type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { recipients, subject, htmlContent, template = 'custom' } = req.body;

    // Get recipient details
    const waitlistEntries = await Waitlist.find({
      _id: { $in: recipients }
    });

    if (waitlistEntries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid recipients found'
      });
    }

    // Send emails
    const emailPromises = waitlistEntries.map(async (entry) => {
      try {
        let emailContent = htmlContent;
        
        // Replace placeholders
        emailContent = emailContent.replace(/\{\{firstName\}\}/g, entry.firstName);
        emailContent = emailContent.replace(/\{\{lastName\}\}/g, entry.lastName);
        emailContent = emailContent.replace(/\{\{fullName\}\}/g, entry.fullName);
        emailContent = emailContent.replace(/\{\{email\}\}/g, entry.email);
        emailContent = emailContent.replace(/\{\{company\}\}/g, entry.company || '');

        await sendEmail(entry.email, subject, emailContent);

        // Update status to notified
        await Waitlist.findByIdAndUpdate(entry._id, {
          status: 'notified',
          notifiedAt: new Date()
        });

        return { success: true, email: entry.email };
      } catch (error) {
        console.error(`Failed to send email to ${entry.email}:`, error);
        return { success: false, email: entry.email, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `Emails sent successfully`,
      data: {
        total: results.length,
        successful,
        failed,
        results
      }
    });

  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/waitlist/:id/status
// @desc    Update waitlist entry status
// @access  Private (Admin only)
router.put('/:id/status', auth, [
  body('status').isIn(['pending', 'notified', 'converted']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status } = req.body;
    const updateData = { status };

    if (status === 'notified') {
      updateData.notifiedAt = new Date();
    } else if (status === 'converted') {
      updateData.convertedAt = new Date();
    }

    const entry = await Waitlist.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Waitlist entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: entry
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/waitlist/:id
// @desc    Delete waitlist entry
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Waitlist.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Waitlist entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete waitlist entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
