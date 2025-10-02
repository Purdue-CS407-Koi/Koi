import { useQuery, useMutation } from "@tanstack/react-query";

import type { NewSplit } from "@/interfaces/Split";
import { insertNewSplit as insertNewSplitApi, getSplit, getSplitByCurrentUser } from "@/api/split";
import { useSplitStore } from "@/stores/useSplitStore";

const useSplits = () => {
  const currentSplitId = useSplitStore((state) => state.currentSplitId);
  const {
    data: splitData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["split", currentSplitId], // Zustand state as part of key
    queryFn: () => getSplit(currentSplitId),
  });

  const {
    data: userSplitsData,
    isLoading: isLoadingUserSplits,
    error: errorUserSplits,
  } = useQuery({
    queryKey: ["split"], // Zustand state as part of key
    queryFn: () => getSplitByCurrentUser(),
  });

  const mutation = useMutation({
    mutationFn: insertNewSplitApi,
    onError: (err) => {
      console.log("error inserting new split: " + JSON.stringify(err));
    },
  });

  const insertNewSplit = (split: NewSplit) => {
    mutation.mutate(split);
  };

  return { splitData, isLoading, error, insertNewSplit, userSplitsData, isLoadingUserSplits, errorUserSplits };
};

export default useSplits;