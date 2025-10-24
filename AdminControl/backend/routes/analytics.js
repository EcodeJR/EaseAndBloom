const express = require('express');
const { query, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const Story = require('../models/Story');
const Admin = require('../models/Admin');
const { authenticate, requirePermission } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private (Admin only)
router.get('/dashboard', authenticate, requirePermission('canViewAnalytics'), async (req, res) => {
  try {
    // Get basic counts
    const [
      totalBlogs,
      totalStories,
      pendingStories,
      publishedStories,
      totalViews
    ] = await Promise.all([
      Blog.countDocuments(),
      Story.countDocuments(),
      Story.countDocuments({ status: 'pending' }),
      Story.countDocuments({ status: 'published' }),
      Promise.all([
        Blog.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
        Story.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }])
      ]).then(([blogViews, storyViews]) => 
        (blogViews[0]?.total || 0) + (storyViews[0]?.total || 0)
      )
    ]);

    // Get recent activity
    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt')
      .populate('createdBy', 'name');

    const recentStories = await Story.find()
      .sort({ submittedAt: -1 })
      .limit(5)
      .select('title status submittedAt submitterName')
      .populate('reviewedBy', 'name');

    // Get views trend for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const viewsTrend = await Blog.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          views: { $sum: '$views' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalBlogs,
          totalStories,
          pendingStories,
          publishedStories,
          totalViews
        },
        viewsTrend,
        recentActivity: {
          blogs: recentBlogs,
          stories: recentStories
        }
      }
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/analytics/blogs
// @desc    Get blog analytics
// @access  Private (Admin only)
router.get('/blogs', authenticate, requirePermission('canViewAnalytics'), [
  query('period').optional().isIn(['7d', '30d', '90d', '1y', 'all']),
  query('category').optional().isString()
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

    const period = req.query.period || '30d';
    const category = req.query.category;

    // Calculate date range
    let dateFilter = {};
    if (period !== 'all') {
      const days = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      };
      
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days[period]);
      dateFilter.createdAt = { $gte: daysAgo };
    }

    // Build query
    let query = { ...dateFilter };
    if (category) {
      query.categories = category;
    }

    // Get blog statistics
    const [
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalViews,
      blogsByCategory,
      topBlogs
    ] = await Promise.all([
      Blog.countDocuments(query),
      Blog.countDocuments({ ...query, status: 'published' }),
      Blog.countDocuments({ ...query, status: 'draft' }),
      Blog.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]),
      Blog.aggregate([
        { $match: query },
        { $unwind: '$categories' },
        { $group: { _id: '$categories', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Blog.find(query)
        .sort({ views: -1 })
        .limit(10)
        .select('title views status createdAt')
        .populate('createdBy', 'name')
    ]);

    res.json({
      success: true,
      data: {
        period,
        category: category || 'all',
        stats: {
          totalBlogs,
          publishedBlogs,
          draftBlogs,
          totalViews: totalViews[0]?.total || 0
        },
        blogsByCategory,
        topBlogs
      }
    });
  } catch (error) {
    console.error('Blog analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/analytics/stories
// @desc    Get story analytics
// @access  Private (Admin only)
router.get('/stories', authenticate, requirePermission('canViewAnalytics'), [
  query('period').optional().isIn(['7d', '30d', '90d', '1y', 'all']),
  query('category').optional().isString(),
  query('status').optional().isIn(['pending', 'approved', 'published', 'rejected'])
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

    const period = req.query.period || '30d';
    const category = req.query.category;
    const status = req.query.status;

    // Calculate date range
    let dateFilter = {};
    if (period !== 'all') {
      const days = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      };
      
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days[period]);
      dateFilter.submittedAt = { $gte: daysAgo };
    }

    // Build query
    let query = { ...dateFilter };
    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }

    // Build query without date filter for counts (to show all stories)
    let countQuery = {};
    if (category) {
      countQuery.category = category;
    }
    if (status) {
      countQuery.status = status;
    }

    // Get story statistics
    const [
      totalStories,
      pendingStories,
      approvedStories,
      publishedStories,
      rejectedStories,
      totalViews,
      storiesByCategory,
      storiesByStatus,
      topStories
    ] = await Promise.all([
      Story.countDocuments(countQuery),
      Story.countDocuments({ ...countQuery, status: 'pending' }),
      Story.countDocuments({ ...countQuery, status: 'approved' }),
      Story.countDocuments({ ...countQuery, status: 'published' }),
      Story.countDocuments({ ...countQuery, status: 'rejected' }),
      Story.aggregate([
        { $match: countQuery },
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]),
      Story.aggregate([
        { $match: category ? { category } : {} }, // Show all categories
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Story.aggregate([
        { $match: countQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Story.find(countQuery)
        .sort({ views: -1 })
        .limit(10)
        .select('title views status submittedAt submitterName')
        .populate('reviewedBy', 'name')
    ]);

    res.json({
      success: true,
      data: {
        period,
        category: category || 'all',
        status: status || 'all',
        stats: {
          totalStories,
          pendingStories,
          approvedStories,
          publishedStories,
          rejectedStories,
          totalViews: totalViews[0]?.total || 0
        },
        storiesByCategory,
        storiesByStatus,
        topStories
      }
    });
  } catch (error) {
    console.error('Story analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/analytics/views
// @desc    Get views analytics over time
// @access  Private (Admin only)
router.get('/views', authenticate, requirePermission('canViewAnalytics'), [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']),
  query('type').optional().isIn(['blogs', 'stories', 'all'])
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

    const period = req.query.period || '30d';
    const type = req.query.type || 'all';

    // Calculate date range
    const days = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days[period]);

    let blogViews = [];
    let storyViews = [];

    if (type === 'all' || type === 'blogs') {
      blogViews = await Blog.aggregate([
        { $match: { createdAt: { $gte: daysAgo } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            views: { $sum: '$views' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);
    }

    if (type === 'all' || type === 'stories') {
      storyViews = await Story.aggregate([
        { $match: { publishedAt: { $gte: daysAgo } } },
        {
          $group: {
            _id: {
              year: { $year: '$publishedAt' },
              month: { $month: '$publishedAt' },
              day: { $dayOfMonth: '$publishedAt' }
            },
            views: { $sum: '$views' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);
    }

    res.json({
      success: true,
      data: {
        period,
        type,
        blogViews,
        storyViews
      }
    });
  } catch (error) {
    console.error('Views analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
