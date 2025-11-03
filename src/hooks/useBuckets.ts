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
  getEndDate,
  getStartDate,
  RecurrencePeriodType,
} from "@/interfaces/Bucket";
import { useBucketsStore } from "@/stores/useBucketsStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addMilliseconds, subMilliseconds } from "date-fns";
import useExpenses from "./useExpenses";

export const useBuckets = () => {
  const currentBucketInstanceId = useBucketsStore(
    (state) => state.currentBucketInstanceId,
  );

  const setCurrentBucketInstanceId = useBucketsStore(
    (state) => state.setCurrentBucketInstanceId,
  );

  const currentBucketMetadataId = useBucketsStore(
    (state) => state.currentBucketMetadataId,
  );

  const setCurrentBucketMetadataId = useBucketsStore(
    (state) => state.setCurrentBucketMetadataId,
  );

  const { createRecurringExpensesForNewBucketInstance } = useExpenses();

  const createMetadataMutation = useMutation({
    mutationFn: createBucketMetadataApi,
    onSuccess: (data) => {
      console.log("Created bucket metadata entry, data returned: ", data);
      refetchBucketMetadata();
      return data;
    },
    onError: (err) => {
      console.log(
        "Error creating new bucket metadata entry: " + JSON.stringify(err),
      );
    },
  });

  const createInstanceMutation = useMutation({
    mutationFn: createBucketInstanceApi,
    onSuccess: (data) => {
      console.log("Created bucket instance entry, data returned:", data);
      createRecurringExpensesForNewBucketInstance(data.id);
      refetchBucketInstance();
    },
    onError: (err) => {
      console.log(
        "Error creating new bucket instance entry: " + JSON.stringify(err),
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

  const createBucketMetadata = async (
    bucketMetadata: TablesInsert<"BucketMetadata">,
  ) => {
    return createMetadataMutation.mutate(bucketMetadata);
  };

  const createBucketMetadataAsync = async (
    bucketMetadata: TablesInsert<"BucketMetadata">,
  ) => {
    return createMetadataMutation.mutateAsync(bucketMetadata);
  };

  const createBucketInstance = async (
    bucketInstance: TablesInsert<"BucketInstances">,
  ) => {
    return createInstanceMutation.mutate(bucketInstance);
  };

  const createBucketInstanceAsync = async (
    bucketInstance: TablesInsert<"BucketInstances">,
  ) => {
    return createInstanceMutation.mutateAsync(bucketInstance);
  };

  const hideBucketMetadata = async (bucketMetadataId: string) => {
    return hideMetadataMutation.mutate(bucketMetadataId);
  };

  const editBucketMetadata = async (
    bucketMetadataId: string,
    updatedData: TablesUpdate<"BucketMetadata">,
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
            instance.hidden_at === null,
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

          // Trigger a refetch now we have a "Main" bucket
          refetchBucketMetadata();
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

      const currentBucket = bucketMetadataData?.find(
        (x) => x.id === currentBucketMetadataId,
      );

      const bucketInstances = await getAllBucketInstances(
        currentBucketMetadataId,
      );

      if (
        !currentBucketInstanceId ||
        !bucketInstances.some(
          (instance) => instance.id === currentBucketInstanceId,
        )
      ) {
        if (bucketInstances.length > 0) {
          // Set the bucket instance to the one for today's date
          setCurrentBucketInstanceId(await getInstanceIdForDate(new Date()));
        } else {
          console.warn("No bucket instance found, automatically creating one!");
          const startDate = getStartDate(
            new Date(),
            currentBucket?.recurrence_period_type as RecurrencePeriodType,
          );
          const endDate = getEndDate(
            startDate,
            currentBucket?.recurrence_period_type as RecurrencePeriodType,
          );
          createBucketInstance({
            bucket_metadata_id: currentBucketMetadataId,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          });

          // Trigger a refetch now we have a bucket instance
          refetchBucketInstance();
        }
      }

      return bucketInstances;
    },
  });

  /// Finds and returns the instance ID for the given date. Will also automatically
  /// create instances if needed.
  const getInstanceIdForDate = async (date: Date): Promise<string> => {
    if (!currentBucketMetadataId) {
      throw new Error("No bucket has been selected!");
    }

    const currentBucket = bucketMetadataData?.find(
      (x) => x.id === currentBucketMetadataId,
    );

    const bucketInstances = await getAllBucketInstances(
      currentBucketMetadataId,
    );

    // Sort bucket by start date
    bucketInstances.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );

    // Depending on whether the given date is in the range or not...
    if (
      bucketInstances.some((instance) => {
        const startDate = new Date(instance.start);
        const endDate = new Date(instance.end);
        return date >= startDate && date <= endDate;
      })
    ) {
      // In range, find the instance ID for instance start/end that encloses date and return
      const targetInstance = bucketInstances.find((instance) => {
        const startDate = new Date(instance.start);
        const endDate = new Date(instance.end);
        return date >= startDate && date <= endDate;
      });
      return targetInstance!.id;
    } else {
      // Start walking backwards or forwards, creating buckets as we go.
      if (date.getTime() < new Date(bucketInstances[0].start).getTime()) {
        // Walk backwards
        let lastDate = new Date(bucketInstances[0].start);

        while (date < lastDate) {
          const endDate = getEndDate(
            subMilliseconds(lastDate, 1),
            currentBucket?.recurrence_period_type as RecurrencePeriodType,
          );
          const startDate = getStartDate(
            endDate,
            currentBucket?.recurrence_period_type as RecurrencePeriodType,
          );

          const newBucket = await createBucketInstanceAsync({
            bucket_metadata_id: currentBucketMetadataId,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          });
          lastDate = startDate;

          if (lastDate <= date) {
            return newBucket.id;
          }
        }
      } else {
        // Walk forwards
        let lastDate = new Date(
          bucketInstances[bucketInstances.length - 1].end,
        );

        while (date > lastDate) {
          const startDate = getStartDate(
            addMilliseconds(lastDate, 1),
            currentBucket?.recurrence_period_type as RecurrencePeriodType,
          );
          const endDate = getEndDate(
            startDate,
            currentBucket?.recurrence_period_type as RecurrencePeriodType,
          );

          const newBucket = await createBucketInstanceAsync({
            bucket_metadata_id: currentBucketMetadataId,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          });
          lastDate = endDate;

          if (lastDate >= date) {
            return newBucket.id;
          }
        }
      }
    }

    throw new Error("Failed to get instance ID for date, iteration failed");
  };

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
