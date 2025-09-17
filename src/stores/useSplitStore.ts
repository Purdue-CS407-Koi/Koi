import { create } from "zustand";

interface SplitStore {
  currentSplitId: string;
  setCurrentSplitId: (splitId: string) => void;
}

export const useSplitStore = create<SplitStore>((set) => ({
  currentSplitId: "b20764ba-7271-43dd-908c-f8eba7d674de",
  setCurrentSplitId: (splitId) => set({ currentSplitId: splitId }),
}));
