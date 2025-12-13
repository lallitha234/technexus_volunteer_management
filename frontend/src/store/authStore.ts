import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '../types/index.js';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAdmin: false,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, isAdmin: user?.role === 'admin' }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      logout: () => set({ user: null, token: null, isAdmin: false, error: null }),
    }),
    {
      name: 'auth-store',
    }
  )
);
