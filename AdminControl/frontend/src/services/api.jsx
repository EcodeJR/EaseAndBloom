import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Include cookies for refresh token
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh if:
    // 1. Response is 401
    // 2. Not already retried
    // 3. Not the refresh endpoint itself
    // 4. Not the login endpoint
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      originalRequest._retry = true;

      // Check if we have an access token to refresh
      const hasAccessToken = localStorage.getItem('accessToken');
      if (!hasAccessToken) {
        // No token to refresh, just reject
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken, admin } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('admin', JSON.stringify(admin));

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('admin');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Blogs API
export const blogsAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getById: (id) => api.get(`/blogs/id/${id}`),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
};

// Stories API
export const storiesAPI = {
  getAll: (params) => api.get('/stories', { params }),
  getById: (id) => api.get(`/stories/${id}`),
  submit: (data) => api.post('/stories', data),
  getAllAdmin: (params) => api.get('/stories/admin/all', { params }),
  approve: (id) => api.put(`/stories/${id}/approve`),
  publish: (id) => api.put(`/stories/${id}/publish`),
  reject: (id, data) => api.put(`/stories/${id}/reject`, data),
  update: (id, data) => api.put(`/stories/${id}`, data),
  delete: (id) => api.delete(`/stories/${id}`),
};

// Admins API
export const adminsAPI = {
  getAll: (params) => api.get('/admins', { params }),
  getById: (id) => api.get(`/admins/${id}`),
  create: (data) => api.post('/admins', data),
  update: (id, data) => api.put(`/admins/${id}`, data),
  delete: (id) => api.delete(`/admins/${id}`),
  updateProfile: (data) => api.put('/admins/profile', data),
  changePassword: (data) => api.put('/admins/change-password', data),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getBlogs: (params) => api.get('/analytics/blogs', { params }),
  getStories: (params) => api.get('/analytics/stories', { params }),
  getViews: (params) => api.get('/analytics/views', { params }),
};

// Waitlist API
export const waitlistAPI = {
  getAll: (params) => api.get(`/waitlist?${params}`),
  getStats: () => api.get('/waitlist/stats'),
  sendNotification: (data) => api.post('/waitlist/send-notification', data),
  updateStatus: (id, data) => api.put(`/waitlist/${id}/status`, data),
  deleteEntry: (id) => api.delete(`/waitlist/${id}`),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (data) => api.post('/upload/image', data),
};

export default api;
