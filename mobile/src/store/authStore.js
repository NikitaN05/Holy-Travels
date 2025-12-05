import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

      googleLogin: async (accessToken, googleUser) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/google/mobile', { 
            accessToken, 
            user: googleUser 
          });
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

      fetchProfile: async () => {
        try {
          const response = await api.get('/auth/me');
          const { user, traveller } = response.data.data;
          set({ user, traveller });
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      },

      setLanguage: (language) => {
        set(state => ({
          user: { ...state.user, preferredLanguage: language }
        }));
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;

