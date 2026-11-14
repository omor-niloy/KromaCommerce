import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthModalOpen: boolean;
  setUser: (user: User | null, accessToken?: string | null) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthModalOpen: false,

  setUser: (user, accessToken = null) => {
    if (typeof window !== 'undefined' && accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    set({ user, accessToken: accessToken || null });
  },

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    set({ user: null, accessToken: null });
  },
}));
