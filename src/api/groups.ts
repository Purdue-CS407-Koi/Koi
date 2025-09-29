import supabase from "@/helpers/supabase";

export interface Group {
  id: string;
  name: string;
  created_at?: string;
}

export async function insertGroup(name: string) {
  const { data, error } = await supabase
    .from("Groups")
    .insert([
      { name: name },
    ])
    .select();
  
  if (error) throw error;
  return data;
}

export async function insertGroupMembership(userId: string, groupId: string) {
  const { data, error } = await supabase
    .from("GroupMemberships")
    .insert([{ user_id: userId, group_id: groupId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
