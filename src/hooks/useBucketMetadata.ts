import { useQuery } from "@tanstack/react-query";
import { useBucketMetadataStore } from "../stores/useBucketMetadataStore";
import supabase from "../helpers/supabase";

const fetchBucketMetadata = async (id: string) => {
  const { data, error } = await supabase
    .from("BucketMetadata")
    .select()
    .eq("id", id);

  if (error) {
    throw error;
  }

  if (data.length <= 0 || data.length > 1) {
    throw Error("ID does not exist or is not unique");
  }

  return data[0];
};

const useBucketMetadata = () => {
  const currentBucketMetadataId = useBucketMetadataStore((state) => state.currentBucketMetadataId);
  const {
    data: bucketData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bucketMetadata", currentBucketMetadataId], // Zustand state as part of key
    queryFn: () => fetchBucketMetadata(currentBucketMetadataId),
  });

  return { bucketData, isLoading, error };
};

export default useBucketMetadata;