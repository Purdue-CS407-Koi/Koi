import { useQuery } from "@tanstack/react-query";
import { useGroupStore } from "../stores/useGroupStore";
import supabase from "../helpers/supabase";

const fetchGroup = async (id: string) => {
  const { data, error } = await supabase
    .from("Groups")
    .select()
    .eq("id", id);

  if (error) {
    throw error;
  }

  if (data.length <= 0 || data.length > 1) {
    throw Error("ID does not exist or is not unique");
  }

  return data[0];
};

const useGroups = () => {
  const currentGroupId = useGroupStore((state) => state.currentGroupId);
  const {
    data: groupData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["group", currentGroupId], // Zustand state as part of key
    queryFn: () => fetchGroup(currentGroupId),
  });

  return { groupData, isLoading, error };
};

export default useGroups;