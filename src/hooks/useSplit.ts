import { useMutation } from "@tanstack/react-query";
import type { NewSplit } from "../interfaces/Split";
import { insertNewSplit as insertNewSplitApi } from "../api/split";

const useSplit = () => {
  const mutation = useMutation({
    mutationFn: insertNewSplitApi,
    onError: (err) => {
      console.log("error inserting new split: " + JSON.stringify(err));
    },
  });

  const insertNewSplit = (split: NewSplit) => {
    mutation.mutate(split);
  };

  return { insertNewSplit };
};

export default useSplit;
