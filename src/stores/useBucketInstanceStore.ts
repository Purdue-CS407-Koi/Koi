import { create } from "zustand";

interface BucketInstanceStore {
  currentBucketInstanceId: string;
  setCurrentBucketInstanceId: (bucketInstanceId: string) => void;
}

export const useBucketInstanceStore = create<BucketInstanceStore>((set) => ({
  currentBucketInstanceId: "e73b609a-e8dc-424b-bbac-5bd42d54a88b",
  setCurrentBucketInstanceId: (bucketInstanceId) => set({ currentBucketInstanceId: bucketInstanceId }),
}));
