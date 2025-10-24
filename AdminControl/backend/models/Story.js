const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [50, 'Content must be at least 50 characters'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  submitterName: {
    type: String,
    default: 'Anonymous',
    trim: true,
    maxlength: [100, 'Submitter name cannot exceed 100 characters']
  },
  submitterEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    select: false // Don't include email in public queries
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
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
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'published', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },
  views: {
    type: Number,
    default: 0
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Update reviewedAt when status changes to approved, published, or rejected
storySchema.pre('save', function(next) {
  if (this.isModified('status') && ['approved', 'published', 'rejected'].includes(this.status)) {
    this.reviewedAt = new Date();
  }
  
  if (this.isModified('status') && this.status === 'published') {
    this.publishedAt = new Date();
  }
  
  next();
});

// Index for better query performance
storySchema.index({ status: 1, createdAt: -1 });
storySchema.index({ category: 1 });
storySchema.index({ publishedAt: -1 });
storySchema.index({ views: -1 });

module.exports = mongoose.model('Story', storySchema);
