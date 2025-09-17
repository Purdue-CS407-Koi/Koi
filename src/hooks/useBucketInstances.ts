import { useQuery } from "@tanstack/react-query";
import { useBucketInstanceStore } from "../stores/useBucketInstanceStore";
import supabase from "../helpers/supabase";

const fetchBucketInstance = async (id: string) => {
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

const useBucketInstances = () => {
  const currentBucketId = useBucketInstanceStore((state) => state.currentBucketInstanceId);
  const {
    data: bucketData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bucketInstance", currentBucketId], // Zustand state as part of key
    queryFn: () => fetchBucketInstance(currentBucketId),
  });

  return { bucketData, isLoading, error };
};

export default useBucketInstances;