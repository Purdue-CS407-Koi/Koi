import { create } from "zustand";

interface UserStore {
  currentUserId: string;
  setCurrentUserId: (userId: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUserId: "caa1f7f9-5d65-44ec-8be4-4a3c8a656bd6",
  setCurrentUserId: (userId) => set({ currentUserId: userId }),
}));
