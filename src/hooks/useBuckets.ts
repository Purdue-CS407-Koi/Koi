import { useBucketsStore } from "@/stores/useBucketsStore";

export const useBuckets = () => {
  const setCurrentBucketMetadataId = useBucketsStore(
    (state) => state.setCurrentBucketMetadataId
  );

  const selectBucket = (bucket_id: string) => {
    setCurrentBucketMetadataId(bucket_id);
  };

  // TO-DO: useQueries that fetch a user's buckets (metadata and instances)

  return { selectBucket };
};
