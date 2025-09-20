import { create } from "zustand";

interface LinkStore {
  currentLink: number;
  setCurrentLink: (currentLink: number) => void;
}

export const useLinkStore = create<LinkStore>((set) => ({
  currentLink: 0,
  setCurrentLink: (link) => set({ currentLink: link }),
}));