import { create } from "zustand";

interface BucketStore {
  currentBucketId: string;
  setCurrentBucketId: (currentBucketId: string) => void;
}

export const useBucketStore = create<BucketStore>((set) => ({
  currentBucketId: "e73b609a-e8dc-424b-bbac-5bd42d54a88b",
  setCurrentBucketId: (currentBucketId) => set({ currentBucketId }),
}));
