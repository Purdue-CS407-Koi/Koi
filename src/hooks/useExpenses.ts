import { useMutation, useQuery } from "@tanstack/react-query";
import type { NewExpense } from "@/interfaces/Expense";
import {
  insertNewExpense as insertNewExpenseApi,
  getExpensesFromBucket,
} from "@/api/expenses";
import { useBucketsStore } from "@/stores/useBucketsStore";

const useExpenses = () => {
  const currentBucketInstanceId = useBucketsStore(
    (state) => state.currentBucketInstanceId
  );

  const mutation = useMutation({
    mutationFn: insertNewExpenseApi,
    onError: (err) => {
      console.log("error inserting new expense: " + JSON.stringify(err));
    },
  });

  const {
    data: expenseData,
    error: getExpensesError,
    refetch: refetchExpenses,
  } = useQuery({
    queryKey: ["expenses", currentBucketInstanceId],
    queryFn: async () => {
      const rawData = await getExpensesFromBucket(currentBucketInstanceId);
      return rawData?.map((item) => ({
        ...item,
        created_at: item.created_at.split("T")[0],
      }));
    },
  });

  const insertNewExpense = (expense: NewExpense) => {
    mutation.mutate(expense);
  };

  return { expenseData, getExpensesError, refetchExpenses, insertNewExpense };
};

export default useExpenses;
