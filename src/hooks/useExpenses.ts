import { useMutation, useQuery } from "@tanstack/react-query";
import type { UpdateExpenseProps } from "@/interfaces/Expense";
import {
  insertNewExpense as insertNewExpenseApi,
  getExpensesFromBucket,
  updateExpense as updateExpenseApi,
  deleteExpense as deleteExpenseApi,
} from "@/api/expenses";
import { useBucketsStore } from "@/stores/useBucketsStore";
import type { TablesInsert } from "@/helpers/supabase.types";

const useExpenses = () => {
  const currentBucketInstanceId = useBucketsStore(
    (state) => state.currentBucketInstanceId
  );

  const createExpenseMutation = useMutation({
    mutationFn: insertNewExpenseApi,
    onError: (err) => {
      console.log("error inserting new expense: " + JSON.stringify(err));
    },
    onSuccess: () => {
      refetchExpenses();
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: updateExpenseApi,
    onError: (err) => {
      console.log("error updating new expense: " + JSON.stringify(err));
    },
    onSuccess: () => {
      refetchExpenses();
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpenseApi,
    onError: (err) => {
      console.log("error deleting new expense: " + JSON.stringify(err));
    },
    onSuccess: () => {
      refetchExpenses();
    },
  });

  const {
    data: expenseData,
    error: getExpensesError,
    refetch: refetchExpenses,
  } = useQuery({
    queryKey: ["expenses", currentBucketInstanceId],
    queryFn: async () => {
      if (!currentBucketInstanceId) {
        return [];
      }

      const rawData = await getExpensesFromBucket(currentBucketInstanceId);
      return rawData?.map((item) => ({
        ...item,
        created_at: item.created_at.split("T")[0],
      }));
    },
  });

  const insertNewExpense = (expense: TablesInsert<"Expenses">) => {
    createExpenseMutation.mutate(expense);
  };

  const insertNewExpenseAndReturn = async (
    expense: TablesInsert<"Expenses">
  ) => {
    return await createExpenseMutation.mutateAsync(expense);
  };

  const updateExpense = (expense: UpdateExpenseProps) => {
    updateExpenseMutation.mutate(expense);
  };

  const deleteExpense = (id: string) => {
    deleteExpenseMutation.mutate(id);
  };

  return {
    expenseData,
    getExpensesError,
    refetchExpenses,
    insertNewExpense,
    insertNewExpenseAndReturn,
    updateExpense,
    deleteExpense,
  };
};

export default useExpenses;
