import { useQuery } from "@tanstack/react-query";

import { getCurrentUser, getUserById } from "@/api/users";

const useUsers = (userId?: string | null) => {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"], // Zustand state as part of key
    queryFn: () => getCurrentUser(),
  });

  const {
    data: userProfileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserById(userId),
  });
  

  return { userData, isLoading, error, userProfileData, isProfileLoading, profileError };
};

export default useUsers;