import { useQuery } from "@tanstack/react-query";
import { getAppChallenges } from "@/api/challenges";

const useChallenges = () => {
  const {
    data: appChallengeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["challenges", "appChallenges"],
    queryFn: () => getAppChallenges(),
  });

  return { appChallengeData, isLoading, error };
};

export default useChallenges;