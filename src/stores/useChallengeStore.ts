import { create } from "zustand";

interface ChallengeStore {
  currentChallengeId: string;
  setCurrentChallengeId: (challengeId: string) => void;
}

export const useChallengeStore = create<ChallengeStore>((set) => ({
  currentChallengeId: "5a8b3ddc-caee-4634-a59f-359265b08595",
  setCurrentChallengeId: (challengeId) => set({ currentChallengeId: challengeId }),
}));
