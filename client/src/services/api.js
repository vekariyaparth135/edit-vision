import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Request interceptor to attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected route, clear token
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  resetCredentials: (data) => api.post('/auth/reset-credentials', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (formData) => api.put('/auth/updateprofile', formData),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
  setPasswordDirect: (data) => api.put('/auth/setpassword', data),
  logout: () => api.post('/auth/logout'),
};

// Media APIs
export const mediaApi = {
  getPublic: (params) => api.get('/media', { params }),
  getById: (id) => api.get(`/media/${id}`),
  getAllAdmin: () => api.get('/media/admin/all'),
  create: (formData) => api.post('/media', formData),
  update: (id, formData) => api.put(`/media/${id}`, formData),
  delete: (id) => api.delete(`/media/${id}`),
  reorder: (items) => api.put('/media/reorder', { items }),
  togglePublish: (id) => api.patch(`/media/${id}/toggle-publish`),
};

// Services APIs
export const servicesApi = {
  getPublic: () => api.get('/services'),
  getAllAdmin: () => api.get('/services/admin/all'),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Testimonials APIs
export const testimonialsApi = {
  getPublic: () => api.get('/testimonials'),
  getAllAdmin: () => api.get('/testimonials/admin/all'),
  create: (formData) => api.post('/testimonials', formData),
  update: (id, formData) => api.put(`/testimonials/${id}`, formData),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

// Messages APIs
export const messagesApi = {
  create: (data) => api.post('/messages', data),
  getAllAdmin: (params) => api.get('/messages', { params }),
  updateStatus: (id, data) => api.put(`/messages/${id}`, data),
  delete: (id) => api.delete(`/messages/${id}`),
};

// Settings APIs
export const settingsApi = {
  get: () => api.get('/settings'),
  update: (formData) => api.put('/settings', formData),
};

// Stats APIs
export const statsApi = {
  logVisit: (path) => api.post('/stats/visit', { path }),
  getDashboard: () => api.get('/stats/dashboard'),
  getLogs: () => api.get('/stats/logs'),
};

export default api;
