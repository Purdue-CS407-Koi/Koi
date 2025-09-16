import { create } from "zustand";

interface BucketStore {
  currentBucketId: string;
  setCurrentBucketId: (currentBucketId: string) => void;
}

export const useBucketStore = create<BucketStore>((set) => ({
  currentBucketId: "1",
  setCurrentBucketId: (currentBucketId) => set({ currentBucketId }),
}));
