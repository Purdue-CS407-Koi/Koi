import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/api/users";

const useUsers = () => {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"], // Zustand state as part of key
    queryFn: () => getCurrentUser(),
  });

  return { userData, isLoading, error };
};

export default useUsers;