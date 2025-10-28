import { useQuery } from "@tanstack/react-query";
import { getAppChallenges, getGroupChallenges } from "@/api/challenges";

const useChallenges = () => {
  const {
    data: appChallengeData,
    isLoading: isAppLoading,
    error: appError,
  } = useQuery({
    queryKey: ["challenges", "appChallenges"],
    queryFn: () => getAppChallenges(),
  });

  const {
    data: groupChallengeData,
    isLoading: isGroupLoading,
    error: groupError,
  } = useQuery({
    queryKey: ["challenges", "groupChallenges"],
    queryFn: () => getGroupChallenges(),
  });

  const {
    data: activeChallengeData,
    isLoading: isActiveLoading,
    error: activeError,
  } = useQuery({
    queryKey: ["challenges", "activeChallenges"],
    queryFn: () => getGroupChallenges(),
  });

  return { 
    appChallengeData, 
    groupChallengeData, 
    activeChallengeData, 
    isAppLoading, 
    isGroupLoading, 
    isActiveLoading,
    appError, 
    groupError,
    activeError,
  };
};

export default useChallenges;