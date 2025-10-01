import { create } from "zustand";

interface BucketsStore {
  currentBucketMetadataId: string;
  currentBucketInstanceId: string;
  setCurrentBucketMetadataId: (bucketMetadataId: string) => void;
  setCurrentBucketInstanceId: (bucketInstanceId: string) => void;
}

export const useBucketsStore = create<BucketsStore>((set) => ({
  currentBucketMetadataId: "b78d6c7c-8fdf-40fe-96f7-956504bbda73",
  currentBucketInstanceId: "e73b609a-e8dc-424b-bbac-5bd42d54a88b",
  setCurrentBucketInstanceId: (bucketMetadataId) =>
    set({ currentBucketMetadataId: bucketMetadataId }),
  setCurrentBucketMetadataId: (bucketInstanceId) =>
    set({ currentBucketInstanceId: bucketInstanceId }),
}));
