const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['super_admin', 'blog_manager', 'story_moderator'],
    default: 'blog_manager'
  },
  permissions: {
    canManageBlogs: {
      type: Boolean,
      default: true
    },
    canManageStories: {
      type: Boolean,
      default: true
    },
    canManageAdmins: {
      type: Boolean,
      default: false
    },
    canViewAnalytics: {
      type: Boolean,
      default: true
    },
    canManageWaitlist: {
      type: Boolean,
      default: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Set permissions based on role
adminSchema.pre('save', function(next) {
  if (this.isModified('role')) {
    switch (this.role) {
      case 'super_admin':
        this.permissions = {
          canManageBlogs: true,
          canManageStories: true,
          canManageAdmins: true,
          canViewAnalytics: true,
          canManageWaitlist: true
        };
        break;
      case 'blog_manager':
        this.permissions = {
          canManageBlogs: true,
          canManageStories: false,
          canManageAdmins: false,
          canViewAnalytics: true,
          canManageWaitlist: true
        };
        break;
      case 'story_moderator':
        this.permissions = {
          canManageBlogs: false,
          canManageStories: true,
          canManageAdmins: false,
          canViewAnalytics: true,
          canManageWaitlist: true
        };
        break;
    }
  }
  next();
});

module.exports = mongoose.model('Admin', adminSchema);
