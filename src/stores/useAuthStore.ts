import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'koi-user-store',
      storage: createJSONStorage(() => sessionStorage)
    },
  ),
);
