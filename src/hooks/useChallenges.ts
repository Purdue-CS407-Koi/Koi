import { useQuery } from "@tanstack/react-query";

import { useChallengeStore } from "@/stores/useChallengeStore";
import supabase from "@/helpers/supabase";

const fetchChallenge = async (id: string) => {
  const { data, error } = await supabase
    .from("Challenges")
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

const useChallenges = () => {
  const currentChallengeId = useChallengeStore((state) => state.currentChallengeId);
  const {
    data: challengeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["challenge", currentChallengeId], // Zustand state as part of key
    queryFn: () => fetchChallenge(currentChallengeId),
  });

  return { challengeData, isLoading, error };
};

export default useChallenges;