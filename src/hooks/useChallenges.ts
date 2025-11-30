import { useQuery } from "@tanstack/react-query";
import { getAppChallenges } from "@/api/challenges";

const useChallenges = () => {
  const {
    data: appChallengeData,
    isLoading: isAppLoading,
    error: appError,
    refetch: refetchAppChallenges,
  } = useQuery({
    queryKey: ["challenges", "appChallenges"],
    queryFn: () => getAppChallenges(),
  });

  return { appChallengeData, isAppLoading, appError, refetchAppChallenges };
};

export default useChallenges;
