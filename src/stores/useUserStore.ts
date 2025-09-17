import { create } from "zustand";

interface UserStore {
  currentUserId: string;
  setCurrentUserId: (userId: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUserId: "b20764ba-7271-43dd-908c-f8eba7d674de",
  setCurrentUserId: (userId) => set({ currentUserId: userId }),
}));
