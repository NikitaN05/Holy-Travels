import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api'; // Change to your production URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const authData = await AsyncStorage.getItem('auth-storage');
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed.state?.token) {
          config.headers.Authorization = `Bearer ${parsed.state.token}`;
        }
      }
    } catch (e) {
      console.error('Error getting auth token:', e);
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
      // Handle unauthorized
      AsyncStorage.removeItem('auth-storage');
    }
    return Promise.reject(error);
  }
);

// API methods
export const toursAPI = {
  getAll: (params) => api.get('/tours', { params }),
  getFeatured: () => api.get('/tours/featured'),
  getBySlug: (slug) => api.get(`/tours/${slug}`),
  getItinerary: (id) => api.get(`/tours/${id}/itinerary`)
};

export const travellersAPI = {
  getCurrentTrip: () => api.get('/travellers/current-trip'),
  getItinerary: () => api.get('/travellers/itinerary'),
  getStats: () => api.get('/travellers/stats')
};

export const menuAPI = {
  getToday: () => api.get('/menu/today'),
  getWeek: () => api.get('/menu/week')
};

export const emergencyAPI = {
  trigger: (data) => api.post('/emergency/trigger', data),
  getMyAlerts: () => api.get('/emergency/my-alerts'),
  cancel: (id) => api.put(`/emergency/${id}/cancel`)
};

export const pollsAPI = {
  getActive: () => api.get('/polls/active'),
  vote: (id, optionIndex) => api.post(`/polls/${id}/vote`, { optionIndex })
};

export const galleryAPI = {
  getAll: (params) => api.get('/gallery', { params }),
  getById: (id) => api.get(`/gallery/${id}`)
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`)
};

export default api;

