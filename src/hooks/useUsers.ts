import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../stores/useUserStore";
import supabase from "../helpers/supabase";

const fetchUser = async (id: string) => {
  const { data, error } = await supabase
    .from("Users")
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

const useUsers = () => {
  const currentUserId = useUserStore((state) => state.currentUserId);
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", currentUserId], // Zustand state as part of key
    queryFn: () => fetchUser(currentUserId),
  });

  return { userData, isLoading, error };
};

export default useUsers;