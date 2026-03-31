import { create } from 'zustand';
import type { User } from '@/types';
import { api } from '@/lib/axios';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const result = data.data;
      localStorage.setItem('refreshToken', result.refreshToken);
      set({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    const { refreshToken } = get();
    if (refreshToken) {
      api.post('/auth/logout', { refreshToken }).catch(() => {});
    }
    localStorage.removeItem('refreshToken');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  refreshAccessToken: async () => {
    const { refreshToken } = get();
    if (!refreshToken) throw new Error('No refresh token');
    const { data } = await api.post('/auth/refresh', { refreshToken });
    const result = data.data;
    localStorage.setItem('refreshToken', result.refreshToken);
    set({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      isAuthenticated: true,
    });
  },

  setUser: (user: User) => set({ user }),
}));
