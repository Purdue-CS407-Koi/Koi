import { useQuery } from "@tanstack/react-query";
import { useExpenseStore } from "../stores/useExpenseStore";
import supabase from "../helpers/supabase";

const fetchExpense = async (id: string) => {
  const { data, error } = await supabase
    .from("Expenses")
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

const useExpenses = () => {
  const currentExpenseId = useExpenseStore((state) => state.currentExpenseId);
  const {
    data: expenseData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expense", currentExpenseId], // Zustand state as part of key
    queryFn: () => fetchExpense(currentExpenseId),
  });

  return { expenseData, isLoading, error };
};

export default useExpenses;