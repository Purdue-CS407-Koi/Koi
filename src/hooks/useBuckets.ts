import {
  createBucketInstance as createBucketInstanceApi,
  createBucketMetadata as createBucketMetadataApi,
  getAllBucketInstances,
  getAllBucketMetadata,
} from "@/api/buckets";
import type { BucketInstance, BucketMetadata } from "@/interfaces/Bucket";
import { useBucketsStore } from "@/stores/useBucketsStore";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useBuckets = () => {
  const currentBucketInstanceId = useBucketsStore(
    (state) => state.currentBucketInstanceId
  );

  const setCurrentBucketInstanceId = useBucketsStore(
    (state) => state.setCurrentBucketInstanceId
  );

  const currentBucketMetadataId = useBucketsStore(
    (state) => state.currentBucketMetadataId
  );

  const setCurrentBucketMetadataId = useBucketsStore(
    (state) => state.setCurrentBucketMetadataId
  );

  const createMetadataMutation = useMutation({
    mutationFn: createBucketMetadataApi,
    onSuccess: (data) => {
      console.log("Created bucket metadata entry, data returned: ", data);
    },
    onError: (err) => {
      console.log(
        "Error creating new bucket metadata entry: " + JSON.stringify(err)
      );
    },
  });

  const createInstanceMutation = useMutation({
    mutationFn: createBucketInstanceApi,
    onSuccess: (data) => {
      console.log("Created bucket instance entry, data returned:", data);
    },
  });

  const createBucketMetadata = async (bucketMetadata: BucketMetadata) => {
    return createMetadataMutation.mutate(bucketMetadata);
  };

  const createBucketInstance = async (bucketInstance: BucketInstance) => {
    return createInstanceMutation.mutate(bucketInstance);
  };

  const selectBucket = (bucketId: string) => {
    setCurrentBucketMetadataId(bucketId);
  };

  const {
    data: bucketMetadataData,
    error: getBucketMetadataError,
    refetch: refetchBucketMetadata,
  } = useQuery({
    queryKey: ["bucketMetadata", currentBucketMetadataId],
    queryFn: getAllBucketMetadata
  });

  const {
    data: bucketInstanceData,
    error: getBucketInstanceError,
    refetch: refetchBucketInstance,
  } = useQuery({
    queryKey: ["bucketInstance", currentBucketMetadataId],
    queryFn: async () => {
          return await getAllBucketInstances(currentBucketMetadataId);
        },
    });
  
  return {
    bucketMetadataData,
    bucketInstanceData,
    getBucketMetadataError,
    getBucketInstanceError,
    refetchBucketMetadata,
    refetchBucketInstance,
    selectBucket,
    createBucketMetadata,
    createBucketInstance,
  };
};
