import { useMutation, useQuery } from "@tanstack/react-query";
import { getAppChallenges, getGroupChallenges, insertChallengeMembership, getActiveChallenges } from "@/api/challenges";

const useChallenges = () => {
  const {
    data: appChallengeData,
    isLoading: isAppLoading,
    error: appError,
    refetch: refetchAppChallenges
  } = useQuery({
    queryKey: ["challenges", "appChallenges"],
    queryFn: () => getAppChallenges(),
  });

  const {
    data: groupChallengeData,
    isLoading: isGroupLoading,
    error: groupError,
    // refetch: refetchGroupChallenges,
  } = useQuery({
    queryKey: ["challenges", "groupChallenges"],
    queryFn: () => getGroupChallenges(),
  });

  const {
    data: activeChallengeData,
    isLoading: isActiveLoading,
    error: activeError,
    refetch: refetchActiveChallenges
  } = useQuery({
    queryKey: ["challenges", "activeChallenges"],
    queryFn: () => getActiveChallenges(),
  });

  const createChallengeMembershipMutation = useMutation({
    mutationFn: insertChallengeMembership,
    onError: (err) => {
      console.log("error inserting new expense: " + JSON.stringify(err));
    },
    onSuccess: () => {
      refetchAppChallenges();
      refetchActiveChallenges();
    },
  });

  const insertNewChallengeMembership = (challenge_id: string) => {
    createChallengeMembershipMutation.mutate(challenge_id);
  };

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
    insertNewChallengeMembership,
  };
};

export default useChallenges;