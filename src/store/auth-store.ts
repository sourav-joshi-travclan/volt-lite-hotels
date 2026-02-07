import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  username?: string;
  [key: string]: unknown;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (user: User | null, isAuthenticated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setAuth: (user, isAuthenticated) => set({ user, isAuthenticated }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "volt-auth" }
  )
);
