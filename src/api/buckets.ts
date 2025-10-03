import supabase from "@/helpers/supabase";
import type { NewBucketMetadata, NewBucketInstance } from "@/interfaces/Bucket";

const METADATA_TABLE_NAME = "BucketMetadata";
const INSTANCE_TABLE_NAME = "BucketInstances";

// Fetches all the BucketMetadata objects associated with the logged-in user
export const getAllBucketMetadata = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Failed to fetch current user!");
  }

  const { data, error } = await supabase
    .from(METADATA_TABLE_NAME)
    .select("*")
    .eq("user_id", user!.id);

  if (error) throw error;
  return data;
};

// Fetches specific BucketMetadata instance
export const getBucketMetadata = async (bucketMetadataId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Failed to fetch current user!");
  }

  const { data, error } = await supabase
    .from(METADATA_TABLE_NAME)
    .select("*")
    .eq("id", bucketMetadataId);

  if (error) throw error;
  if (data.length !== 1)
    throw new Error("Bucket with specified ID doesn't exist!");

  return data[0];
};

// Fetches all the BucketInstance objects of the supplied BucketMetadata ID
export const getAllBucketInstances = async (bucketMetadataId: string) => {
  const { data, error } = await supabase
    .from(INSTANCE_TABLE_NAME)
    .select("*")
    .eq("bucket_metadata_id", bucketMetadataId);

  if (error) throw error;
  return data;
};

// Create new BucketMetadata object
export const createBucketMetadata = async (
  bucketMetadata: NewBucketMetadata
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Failed to fetch current user!");
  }

  const { data, error } = await supabase
    .from(METADATA_TABLE_NAME)
    .insert([
      {
        name: bucketMetadata.name,
        recurrence_period_type: bucketMetadata.recurrence_period_type,
        spending_limit: bucketMetadata.spending_limit,
        user_id: user?.id,
      },
    ])
    .select();
  if (error) throw error;
  return data;
};

export const hideBucketMetadata = async (id: string) => {
  const { data, error } = await supabase
    .from(METADATA_TABLE_NAME)
    .update({ hidden_at: new Date().toDateString() })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

export const editBucketMetadata = async ({
  id,
  updatedData,
}: {
  id: string;
  updatedData: NewBucketMetadata;
}) => {
  const { data, error } = await supabase
    .from(METADATA_TABLE_NAME)
    .update({
      name: updatedData.name,
      recurrence_period_type: updatedData.recurrence_period_type,
      spending_limit: updatedData.spending_limit,
    })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

// Create new BucketInstance object
export const createBucketInstance = async (
  bucketInstance: NewBucketInstance
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Failed to fetch current user!");
  }

  const { data, error } = await supabase
    .from(INSTANCE_TABLE_NAME)
    .insert([
      {
        bucket_metadata_id: bucketInstance.bucket_metadata_id,
        start: bucketInstance.start?.toDateString(),
        end: bucketInstance.end?.toDateString(),
      },
    ])
    .select();
  if (error) throw error;
  return data;
};
