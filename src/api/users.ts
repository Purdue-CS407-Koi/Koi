import supabase from "@/helpers/supabase";

export interface UserProfile {
  id: string;
  name: string;
  created_at?: string;
}

export async function insertUserProfile(userId: string, name: string) {
  const { data, error } = await supabase
    .from("Users")
    .insert([
      {
        id: userId,
        name: name,
      },
    ])
    .select();
  
  if (error) throw error;

  return data;
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("user is undefined");
  }

  const { data, error } = await supabase
    .from("Users")
    .select()
    .eq("id", user?.id);

  if (error) {
    throw error;
  }

  if (data.length <= 0 || data.length > 1) {
    throw Error("ID does not exist or is not unique");
  }

  return data[0];
}
