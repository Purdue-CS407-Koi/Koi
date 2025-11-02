import { useMutation, useQuery } from "@tanstack/react-query";
import { getAppChallenges, getGroupChallenges, insertChallengeMembership, getActiveChallenges, insertChallenge, editChallenge, inviteFriendToChallenge, deleteChallengeMembership } from "@/api/challenges";
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
      console.log("error editing challenge: " + JSON.stringify(err));
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

  const deleteChallengeMembershipMutation = useMutation({
    mutationFn: deleteChallengeMembership,
    onError: (err) => {
      console.log("error leaving challenge: " + JSON.stringify(err));
    },
    onSuccess: () => {
      refetchAppChallenges();
      refetchActiveChallenges();
    },
  });

  const leaveChallenge = (challenge_id: string) => {
    deleteChallengeMembershipMutation.mutate(challenge_id);
  }
  const inviteFriendMutation = useMutation({
    mutationFn: async ({
      challengeId,
      friendEmail,
    }: {
      challengeId: string;
      friendEmail: string;
    }) => inviteFriendToChallenge(challengeId, friendEmail),
    onError: (err) => {
      console.error("Error inviting friend to challenge:", err);
    },
    onSuccess: () => {
      refetchActiveChallenges();
      refetchGroupChallenges();
      refetchAppChallenges();    },
  });

  const inviteFriend = async (challengeId: string, friendEmail: string) => {
    return inviteFriendMutation.mutateAsync({ challengeId, friendEmail });
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
    insertNewChallenge,
    updateChallenge,
    leaveChallenge,
    inviteFriend
  };
};

export default useChallenges;