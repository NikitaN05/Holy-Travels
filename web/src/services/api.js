import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://holy-travels-api.nikitaghatode7.workers.dev/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const parsed = JSON.parse(token);
        if (parsed.state?.token) {
          config.headers.Authorization = `Bearer ${parsed.state.token}`;
        }
      } catch (e) {
        console.error('Error parsing auth token:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  changePassword: (data) => api.put('/auth/change-password', data)
};

export const toursAPI = {
  getAll: (params) => api.get('/tours', { params }),
  getFeatured: () => api.get('/tours/featured'),
  getBySlug: (slug) => api.get(`/tours/${slug}`),
  getItinerary: (id) => api.get(`/tours/${id}/itinerary`),
  getUpcoming: () => api.get('/tours/upcoming'),
  getCategories: () => api.get('/tours/categories')
};

export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason })
};

export const travellersAPI = {
  getCurrentTrip: () => api.get('/travellers/current-trip'),
  getItinerary: () => api.get('/travellers/itinerary'),
  getStats: () => api.get('/travellers/stats')
};

export const menuAPI = {
  getToday: () => api.get('/menu/today'),
  getWeek: () => api.get('/menu/week'),
  getByDate: (date) => api.get(`/menu/${date}`)
};

export const galleryAPI = {
  getAll: (params) => api.get('/gallery', { params }),
  getFeatured: () => api.get('/gallery/featured'),
  getById: (id) => api.get(`/gallery/${id}`),
  likePhoto: (albumId, photoId) => api.put(`/gallery/${albumId}/photos/${photoId}/like`)
};

export const pollsAPI = {
  getActive: () => api.get('/polls/active'),
  getById: (id) => api.get(`/polls/${id}`),
  vote: (id, optionIndex) => api.post(`/polls/${id}/vote`, { optionIndex }),
  getResults: (id) => api.get(`/polls/${id}/results`)
};

export const emergencyAPI = {
  trigger: (data) => api.post('/emergency/trigger', data),
  getMyAlerts: () => api.get('/emergency/my-alerts'),
  cancel: (id) => api.put(`/emergency/${id}/cancel`)
};

export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all')
};

export const reviewsAPI = {
  getByTour: (tourId, params) => api.get(`/reviews/tour/${tourId}`, { params }),
  getFeatured: () => api.get('/reviews/featured'),
  create: (data) => api.post('/reviews', data),
  markHelpful: (id) => api.put(`/reviews/${id}/helpful`)
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getTravelHistory: () => api.get('/users/travel-history'),
  updateEmergencyContacts: (data) => api.put('/users/emergency-contacts', data)
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getTourAnalytics: () => api.get('/admin/analytics/tours'),
  getTravellerAnalytics: () => api.get('/admin/analytics/travellers'),
  exportBookings: (params) => api.get('/admin/export/bookings', { params })
};

export default api;

