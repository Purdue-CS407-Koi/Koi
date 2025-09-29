import { useQuery } from "@tanstack/react-query";

import supabase from "@/helpers/supabase";

const fetchGroupMembers = async (group_id: string) => {
  const { data: users, error } = await supabase
    .from("GroupMemberships")
    .select("id, created_at, Users!inner(id, name)")
    .eq("group_id", group_id);

  if (error) throw error;

  const data = (users ?? []).map((row: any) => row.Users);

  return data;
};

const useGroupMembers = (group_id: string) => {
  const {
    data: groupMembersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["groupMembers", group_id], // Zustand state as part of key
    queryFn: () => fetchGroupMembers(group_id),
  });

  return { groupMembersData, isLoading, error };
};

export default useGroupMembers;