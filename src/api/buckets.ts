import supabase from "@/helpers/supabase";

import type { Tables, TablesInsert, TablesUpdate } from "@/helpers/supabase.types";

const METADATA_TABLE_NAME = "BucketMetadata";
const INSTANCE_TABLE_NAME = "BucketInstances";

// Fetches all the BucketMetadata objects associated with the logged-in user
export const getAllBucketMetadata = async (): Promise<Tables<"BucketMetadata">[]> => {
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
export const getBucketMetadata = async (bucketMetadataId: string): Promise<Tables<"BucketMetadata">> => {
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
export const getAllBucketInstances = async (bucketMetadataId: string): Promise<Tables<"BucketInstances">[]> => {
  const { data, error } = await supabase
    .from(INSTANCE_TABLE_NAME)
    .select("*")
    .eq("bucket_metadata_id", bucketMetadataId);

  if (error) throw error;
  return data;
};

// Create new BucketMetadata object
export const createBucketMetadata = async (
  bucketMetadata: TablesInsert<"BucketMetadata">
): Promise<Tables<"BucketMetadata">> => {
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
  if (data.length !== 1)
    throw new Error("Failed to create new bucket metadata entry!");

  return data[0];
};

export const hideBucketMetadata = async (id: string): Promise<Tables<"BucketMetadata">> => {
  const { data, error } = await supabase
    .from(METADATA_TABLE_NAME)
    .update({ hidden_at: new Date().toISOString() })
    .eq("id", id)
    .select();

  if (error) throw error;
  if (data.length !== 1)
    throw new Error("Failed to hide bucket metadata entry!");

  return data[0];
};

export const editBucketMetadata = async ({
  id,
  updatedData,
}: {
  id: string;
  updatedData: TablesUpdate<"BucketMetadata">;
}): Promise<Tables<"BucketMetadata">> => {
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
  if (data.length !== 1)
    throw new Error("Failed to edit bucket metadata entry!");
  return data[0];
};

// Create new BucketInstance object
export const createBucketInstance = async (
  bucketInstance: TablesInsert<"BucketInstances">
): Promise<Tables<"BucketInstances">> => {
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
        start: bucketInstance.start,
        end: bucketInstance.end,
      },
    ])
    .select();
  if (error) throw error;
  if (data.length !== 1)
    throw new Error("Failed to create bucket instance!");

  return data[0];
};
