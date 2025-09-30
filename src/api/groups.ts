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
    .select()
    .single();
  
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

export async function getUserGroups(userId: string) {
  const { data, error } = await supabase
    .from("GroupMemberships")
    .select(`
      group_id,
      Groups ( id, name, created_at )
    `)
    .eq("user_id", userId);

  if (error) throw error;
  return data.map((gm) => gm.Groups);
}

export async function updateGroupName(groupId: string, newName: string) {
  const { data, error } = await supabase
    .from("Groups")
    .update({ name: newName })
    .eq("id", groupId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export const getGroupMembers = async (groupId: string) => {
  const { data, error } = await supabase
    .from("GroupMemberships")
    .select("user_id, Users(id, name)")
    .eq("group_id", groupId);

  if (error) throw error;

  return (data ?? []).map((item) => ({
    id: item.user_id,
    name: item.Users.name,
  }));
};
