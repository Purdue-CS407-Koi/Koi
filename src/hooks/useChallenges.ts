import { useMutation, useQuery } from "@tanstack/react-query";
import { getAppChallenges, getGroupChallenges, insertChallengeMembership, getActiveChallenges, insertChallenge, editChallenge } from "@/api/challenges";
import type { TablesInsert, TablesUpdate } from "@/helpers/supabase.types";

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
    refetch: refetchGroupChallenges,
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

  const createChallengeMutation = useMutation({
    mutationFn: insertChallenge,
    onError: (err) => {
      console.log("error inserting new challenge: " + JSON.stringify(err));
    },
    onSuccess: () => {
      refetchActiveChallenges();
      refetchGroupChallenges();
      refetchAppChallenges();
    },
  });

  const insertNewChallenge = (challenge: TablesInsert<"Challenges">) => {
    createChallengeMutation.mutate(challenge);
  }

  const editChallengeMutation = useMutation({
    mutationFn: editChallenge,
    onError: (err) => {
      console.log("error inserting new challenge: " + JSON.stringify(err));
    },
    onSuccess: () => {
      refetchActiveChallenges();
      refetchGroupChallenges();
      refetchAppChallenges();
    },
  }); 

  const updateChallenge = (challenge: TablesUpdate<"Challenges">) => {
    editChallengeMutation.mutate(challenge);
  }

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
    insertNewChallenge,
    updateChallenge,
  };
};

export default useChallenges;