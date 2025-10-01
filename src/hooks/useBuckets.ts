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
    onError: (err) => {
      console.log(
        "Error creating new bucket instance entry: " + JSON.stringify(err)
      );
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
    queryFn: async () => {
      const bucketMetadata = await getAllBucketMetadata();

      if (!currentBucketMetadataId) {
        if (bucketMetadata.length > 0) {
          setCurrentBucketMetadataId(bucketMetadata[0].id);
        } else {
          console.error("This user has no buckets and have somehow managed to remove the main bucket!");
        }
      }

      return bucketMetadata;
    }
  });

  const {
    data: bucketInstanceData,
    error: getBucketInstanceError,
    refetch: refetchBucketInstance,
  } = useQuery({
    queryKey: ["bucketInstance", currentBucketMetadataId],
    queryFn: async () => {
      if (!currentBucketMetadataId) {
        return [];
      }

      const bucketInstances = await getAllBucketInstances(currentBucketMetadataId);

      if (!currentBucketInstanceId) {
        if (bucketInstances.length > 0) {
          setCurrentBucketInstanceId(bucketInstances[0].id);
        } else {
          console.error(`No bucket instances found for bucket metadata entry ${currentBucketMetadataId}!`);
        }
      }

      return bucketInstances;
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
