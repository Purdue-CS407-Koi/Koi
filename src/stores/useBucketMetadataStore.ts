import { create } from "zustand";

interface BucketMetadataStore {
  currentBucketMetadataId: string;
  setCurrentBucketMetadataId: (bucketMetadataId: string) => void;
}

export const useBucketMetadataStore = create<BucketMetadataStore>((set) => ({
  currentBucketMetadataId: "b78d6c7c-8fdf-40fe-96f7-956504bbda73",
  setCurrentBucketMetadataId: (bucketMetadataId) => set({ currentBucketMetadataId: bucketMetadataId }),
}));