import { useQuery } from "@tanstack/react-query";

import { useUserStore } from "@/stores/useUserStore";
import supabase from "@/helpers/supabase";

const fetchGroups = async (user_id: string) => {
  const { data, error } = await supabase
    .from("Groups")
    .select("id, name, created_at, GroupMemberships!inner(user_id)")
    .eq("GroupMemberships.user_id", user_id);

  if (error) throw error;
  
  const groups = (data ?? []).map(({ id, name, created_at }) => ({
    id,
    name,
    created_at,
  }));

  return groups;
};

const useGroups = () => {
  const currentUserId = useUserStore((state) => state.currentUserId);
  const {
    data: groupsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["groups", currentUserId], // Zustand state as part of key
    queryFn: () => fetchGroups(currentUserId),
  });

  return { groupsData, isLoading, error };
};

export default useGroups;