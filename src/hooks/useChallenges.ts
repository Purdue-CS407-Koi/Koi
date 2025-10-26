import { useQuery } from "@tanstack/react-query";
import { getAppChallenges } from "@/api/challenges";

import { useChallengeStore } from "@/stores/useChallengeStore";

const useChallenges = () => {
  const currentChallengeId = useChallengeStore((state) => state.currentChallengeId);
  const {
    data: appChallengeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["challenge", currentChallengeId], // Zustand state as part of key
    queryFn: () => getAppChallenges(),
  });

  return { appChallengeData, isLoading, error };
};

export default useChallenges;