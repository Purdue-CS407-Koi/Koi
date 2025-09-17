import { useQuery } from "@tanstack/react-query";
import { useSplitStore } from "../stores/useSplitStore";
import supabase from "../helpers/supabase";

const fetchSplit = async (id: string) => {
  const { data, error } = await supabase
    .from("Splits")
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

const useSplits = () => {
  const currentSplitId = useSplitStore((state) => state.currentSplitId);
  const {
    data: splitData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["split", currentSplitId], // Zustand state as part of key
    queryFn: () => fetchSplit(currentSplitId),
  });

  return { splitData, isLoading, error };
};

export default useSplits;