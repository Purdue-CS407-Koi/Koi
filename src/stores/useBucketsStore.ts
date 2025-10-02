import { create } from "zustand";

interface BucketsStore {
  currentBucketMetadataId: string | null;
  currentBucketInstanceId: string | null;
  setCurrentBucketMetadataId: (bucketMetadataId: string) => void;
  setCurrentBucketInstanceId: (bucketInstanceId: string) => void;
}

export const useBucketsStore = create<BucketsStore>((set) => ({
  currentBucketMetadataId: null,
  currentBucketInstanceId: null,
  setCurrentBucketMetadataId: (bucketMetadataId) =>
    set({ currentBucketMetadataId: bucketMetadataId }),
  setCurrentBucketInstanceId: (bucketInstanceId) =>
    set({ currentBucketInstanceId: bucketInstanceId }),
}));
