import { useQuery, useMutation } from "@tanstack/react-query";

import type { NewSplit } from "@/interfaces/Split";
import { insertNewSplit as insertNewSplitApi, getSplit } from "@/api/split";
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

  const mutation = useMutation({
    mutationFn: insertNewSplitApi,
    onError: (err) => {
      console.log("error inserting new split: " + JSON.stringify(err));
    },
  });

  const insertNewSplit = (split: NewSplit) => {
    mutation.mutate(split);
  };

  return { splitData, isLoading, error, insertNewSplit };
};

export default useSplits;