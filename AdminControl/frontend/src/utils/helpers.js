// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format date for display (date only)
export const formatDateOnly = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  if (!date) return 'Unknown date';

  const now = new Date();
  const past = new Date(date);

  // Check if the date is valid
  if (isNaN(past.getTime())) return 'Invalid date';

  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

// Truncate text to specified length
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    minLength: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
  };
};

// Get status color for UI
export const getStatusColor = (status) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Get role color for UI
export const getRoleColor = (role) => {
  const colors = {
    super_admin: 'bg-purple-100 text-purple-800',
    blog_manager: 'bg-blue-100 text-blue-800',
    story_moderator: 'bg-green-100 text-green-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Convert base64 to file
export const base64ToFile = (base64, filename) => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    'Mental Health': 'bg-blue-100 text-blue-800',
    'Self-Care': 'bg-green-100 text-green-800',
    'Therapy': 'bg-purple-100 text-purple-800',
    'Mindfulness': 'bg-yellow-100 text-yellow-800',
    'Wellness': 'bg-pink-100 text-pink-800',
    'Personal Growth': 'bg-indigo-100 text-indigo-800',
    'Recovery': 'bg-red-100 text-red-800',
    'Coping Strategies': 'bg-orange-100 text-orange-800',
    'Support': 'bg-teal-100 text-teal-800',
    'Resources': 'bg-gray-100 text-gray-800',
    'Recovery Journey': 'bg-red-100 text-red-800',
    'Personal Experience': 'bg-blue-100 text-blue-800',
    'Hope & Healing': 'bg-green-100 text-green-800',
    'Support & Resources': 'bg-teal-100 text-teal-800',
    'Mental Health Awareness': 'bg-purple-100 text-purple-800',
    'Therapy Experience': 'bg-indigo-100 text-indigo-800',
    'Self-Discovery': 'bg-pink-100 text-pink-800',
    'Overcoming Challenges': 'bg-orange-100 text-orange-800',
    'Inspiration': 'bg-yellow-100 text-yellow-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};
// Analytics data transformation utilities

// Transform backend views data into chart-ready format
export const transformViewsData = (viewsData) => {
  if (!viewsData || !Array.isArray(viewsData)) {
    return { labels: [], data: [] };
  }

  // Sort by date
  const sortedData = viewsData.sort((a, b) => {
    const dateA = new Date(a._id.year, a._id.month - 1, a._id.day);
    const dateB = new Date(b._id.year, b._id.month - 1, b._id.day);
    return dateA - dateB;
  });

  const labels = sortedData.map(item => {
    const date = new Date(item._id.year, item._id.month - 1, item._id.day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const data = sortedData.map(item => item.views || item.count || 0);

  return { labels, data };
};

// Transform category aggregation into chart format
export const transformCategoryData = (categoryData) => {
  if (!categoryData || !Array.isArray(categoryData)) {
    return { labels: [], data: [] };
  }

  const labels = categoryData.map(item => item._id || 'Unknown');
  const data = categoryData.map(item => item.count || 0);

  return { labels, data };
};

// Generate proper date labels for time periods
export const generateDateLabels = (period, startDate = new Date()) => {
  const labels = [];
  const start = new Date(startDate);

  let days = 30; // default
  switch (period) {
    case '7d':
      days = 7;
      break;
    case '30d':
      days = 30;
      break;
    case '90d':
      days = 90;
      break;
    case '1y':
      days = 365;
      break;
    default:
      days = 30;
  }

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(start);
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }

  return labels;
};

// Generate dummy data for missing dates in views trend
export const fillMissingViewsData = (viewsData, period = '30d') => {
  const labels = generateDateLabels(period);
  const data = new Array(labels.length).fill(0);

  if (viewsData && Array.isArray(viewsData)) {
    viewsData.forEach(item => {
      const date = new Date(item._id.year, item._id.month - 1, item._id.day);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const index = labels.indexOf(label);
      if (index !== -1) {
        data[index] = item.views || item.count || 0;
      }
    });
  }

  return { labels, data };
};