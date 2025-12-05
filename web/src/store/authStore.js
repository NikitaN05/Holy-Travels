import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      traveller: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setTraveller: (traveller) => set({ traveller }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, token } = response.data.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
          
          // Set token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
          const { user, token } = response.data.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      googleLogin: async (credential) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/google', { credential });
          const { user, token } = response.data.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Google login failed';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          traveller: null,
          isAuthenticated: false,
          error: null
        });
        delete api.defaults.headers.common['Authorization'];
      },

      fetchUserProfile: async () => {
        try {
          const response = await api.get('/auth/me');
          const { user, traveller } = response.data.data;
          set({ user, traveller });
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const response = await api.put('/users/profile', data);
          set({ user: response.data.data.user, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, message: error.response?.data?.message };
        }
      },

      updateLanguage: async (language) => {
        try {
          await api.put('/users/profile', { preferredLanguage: language });
          set(state => ({
            user: { ...state.user, preferredLanguage: language }
          }));
        } catch (error) {
          console.error('Failed to update language:', error);
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;

