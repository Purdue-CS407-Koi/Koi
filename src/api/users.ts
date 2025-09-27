import supabase from "../helpers/supabase";

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
