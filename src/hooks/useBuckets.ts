import {
  createBucketInstance as createBucketInstanceApi,
  createBucketMetadata as createBucketMetadataApi,
  getAllBucketInstances,
  getAllBucketMetadata,
  hideBucketMetadata as hideBucketMetadataApi,
  editBucketMetadata as editBucketMetadataApi,
} from "@/api/buckets";
import type { TablesInsert, TablesUpdate } from "@/helpers/supabase.types";
import {
  RecurrencePeriodType,
} from "@/interfaces/Bucket";
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
      refetchBucketMetadata();
      return data;
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
      refetchBucketInstance();
    },
    onError: (err) => {
      console.log(
        "Error creating new bucket instance entry: " + JSON.stringify(err)
      );
    },
  });

  const hideMetadataMutation = useMutation({
    mutationFn: hideBucketMetadataApi,
    onSuccess: (data) => {
      console.log("Hidden bucket successfully, data returned: ", data);
      refetchBucketMetadata();
    },
    onError: (err) => {
      console.error("Failed to hide bucket: " + JSON.stringify(err));
    },
  });

  const editMetadataMutation = useMutation({
    mutationFn: editBucketMetadataApi,
    onSuccess: (data) => {
      console.log("Edited bucket successfully, data returned: ", data);
      refetchBucketMetadata();
    },
    onError: (err) => {
      console.error("Failed to hide bucket: " + JSON.stringify(err));
    },
  });

  const createBucketMetadata = async (bucketMetadata: TablesInsert<"BucketMetadata">) => {
    return createMetadataMutation.mutate(bucketMetadata);
  };

  const createBucketMetadataAsync = async (
    bucketMetadata: TablesInsert<"BucketMetadata">
  ) => {
    return createMetadataMutation.mutateAsync(bucketMetadata);
  };

  const createBucketInstance = async (bucketInstance: TablesInsert<"BucketInstances">) => {
    return createInstanceMutation.mutate(bucketInstance);
  };

  const hideBucketMetadata = async (bucketMetadataId: string) => {
    return hideMetadataMutation.mutate(bucketMetadataId);
  };

  const editBucketMetadata = async (
    bucketMetadataId: string,
    updatedData: TablesUpdate<"BucketMetadata">
  ) => {
    return editMetadataMutation.mutate({ id: bucketMetadataId, updatedData });
  };

  const {
    data: bucketMetadataData,
    error: getBucketMetadataError,
    refetch: refetchBucketMetadata,
  } = useQuery({
    queryKey: ["bucketMetadata"],
    queryFn: async () => {
      const bucketMetadata = await getAllBucketMetadata();

      // If there is no current ID set, or if the ID points to a bucket that was hidden
      if (
        !currentBucketMetadataId ||
        !bucketMetadata.some(
          (instance) =>
            instance.id === currentBucketMetadataId &&
            instance.hidden_at === null
        )
      ) {
        if (bucketMetadata.length > 0) {
          setCurrentBucketMetadataId(bucketMetadata[0].id);
        } else {
          console.warn("No bucket metadata found, automatically creating one!");
          createBucketMetadata({
            name: "Main",
            recurrence_period_type: RecurrencePeriodType.Monthly,
            spending_limit: null,
          });
        }
      }

      return bucketMetadata;
    },
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

      const bucketInstances = await getAllBucketInstances(
        currentBucketMetadataId
      );

      if (
        !currentBucketInstanceId ||
        !bucketInstances.some(
          (instance) => instance.id === currentBucketInstanceId
        )
      ) {
        if (bucketInstances.length > 0) {
          setCurrentBucketInstanceId(bucketInstances[0].id);
        } else {
          console.warn("No bucket instance found, automatically creating one!");
          createBucketInstance({
            bucket_metadata_id: currentBucketMetadataId,
            start: new Date().toDateString(),
            end: null,
          });
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
    createBucketMetadata,
    createBucketMetadataAsync,
    createBucketInstance,
    hideBucketMetadata,
    editBucketMetadata,
  };
};
