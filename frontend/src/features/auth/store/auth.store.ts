import { create } from 'zustand';
import axios from 'axios';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setUser: (user: User | null) => void;
  setInitializing: (isInitializing: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setInitializing: (isInitializing) => set({ isInitializing }),
  logout: async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/logout`, {}, { withCredentials: true });
    } catch (e) {
      // Ignore errors on logout
    }
    set({ user: null, isAuthenticated: false });
  },
}));
