import { useQuery } from "@tanstack/react-query";
import { useBucketStore } from "../stores/useBucketStore";
import supabase from "../helpers/supabase";

const fetchBucket = async (id: string) => {
  const { data, error } = await supabase
    .from("BucketInstances")
    .select()
    .eq("id", id);

  if (error) {
    throw error;
  }

  console.log(data);

  if (data.length <= 0 || data.length > 1) {
    throw Error("ID does not exist or is not unique");
  }

  return data[0];
};

export const useBuckets = () => {
  const currentBucketId = useBucketStore((state) => state.currentBucketId);
  const {
    data: bucketData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bucket", currentBucketId], // Zustand state as part of key
    queryFn: () => fetchBucket(currentBucketId),
  });

  return { bucketData, isLoading, error };
};
