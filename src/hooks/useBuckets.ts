import { useQuery } from "@tanstack/react-query";
import { useBucketStore } from "../stores/useBucketStore";

// just an example
// in our actual project, the api calls should go in the /api directory
const fetchBuckets = (id: string) => {
  if (id == "1") {
    return { name: "Bucket 1" };
  } else {
    return { name: "Bucket 2" };
  }
};

export const useBuckets = () => {
  const currentBucketId = useBucketStore((state) => state.currentBucketId);
  const {
    data: bucketData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bucket", currentBucketId], // Zustand state as part of key
    queryFn: () => fetchBuckets(currentBucketId),
  });

  return { bucketData, isLoading, error };
};
