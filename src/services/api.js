// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to build URL with query parameters
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

// Generic fetch wrapper with error handling
const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return { response, data };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Blogs API
export const blogsAPI = {
  // Get all blogs with optional filters
  getAll: async (params = {}) => {
    const url = buildUrl('/api/blogs', params);
    return fetchAPI(url);
  },

  // Get single blog by slug or ID
  getBySlug: async (slug) => {
    const url = `${API_BASE_URL}/api/blogs/${slug}`;
    return fetchAPI(url);
  },

  // Get blog by ID
  getById: async (id) => {
    const url = `${API_BASE_URL}/api/blogs/${id}`;
    return fetchAPI(url);
  },
};

// Stories API
export const storiesAPI = {
  // Get all published stories
  getAll: async (params = {}) => {
    const url = buildUrl('/api/stories', params);
    return fetchAPI(url);
  },

  // Get single story by ID
  getById: async (id) => {
    const url = `${API_BASE_URL}/api/stories/${id}`;
    return fetchAPI(url);
  },

  // Submit a new story
  create: async (storyData) => {
    const url = `${API_BASE_URL}/api/stories`;
    return fetchAPI(url, {
      method: 'POST',
      body: JSON.stringify(storyData),
    });
  },
};

// Waitlist API
export const waitlistAPI = {
  // Add email to waitlist
  subscribe: async (email) => {
    const url = `${API_BASE_URL}/api/waitlist`;
    return fetchAPI(url, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Export base URL for direct use if needed
export const getApiBaseUrl = () => API_BASE_URL;
