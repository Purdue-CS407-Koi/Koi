import { useMutation, useQuery } from "@tanstack/react-query";
import type { UpdateExpenseProps } from "@/interfaces/Expense";
import {
  insertNewExpense as insertNewExpenseApi,
  insertNewRecurringExpense as insertNewRecurringExpenseApi,
  getExpensesFromBucket,
  getRecurringExpenses,
  updateExpense as updateExpenseApi,
  deleteExpense as deleteExpenseApi,
} from "@/api/expenses";
import { useBucketsStore } from "@/stores/useBucketsStore";
import type { TablesInsert } from "@/helpers/supabase.types";

const useExpenses = () => {
  const currentBucketInstanceId = useBucketsStore(
    (state) => state.currentBucketInstanceId
  );

  const currentBucketMetadataId = useBucketsStore(
    (state) => state.currentBucketMetadataId
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

  const createRecurringExpenseMutation = useMutation({
    mutationFn: insertNewRecurringExpenseApi,
    onError: (err) => {
      console.log(
        "error inserting new recurring expense: " + JSON.stringify(err)
      );
    },
    onSuccess: (data) => {
      refetchRecurringExpenses();
      if (data[0]) {
        insertNewExpense({
          name: data[0].name!,
          amount: data[0].amount!,
          description: data[0].description,
          bucket_instance_id: currentBucketInstanceId,
        });
      }
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

  const {
    data: recurringExpenseData,
    error: getRecurringExpensesError,
    refetch: refetchRecurringExpenses,
  } = useQuery({
    queryKey: ["expenses", currentBucketMetadataId],
    queryFn: async () => {
      if (!currentBucketMetadataId) {
        return [];
      }

      const rawData = await getRecurringExpenses(currentBucketMetadataId);
      return rawData?.map((item) => ({
        ...item,
        created_at: item.created_at.split("T")[0],
      }));
    },
  });

  const insertNewExpense = (expense: TablesInsert<"Expenses">) => {
    createExpenseMutation.mutate(expense);
  };

  const insertNewRecurringExpense = (
    expense: TablesInsert<"RecurringExpenses">
  ) => {
    createRecurringExpenseMutation.mutate(expense);
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
    recurringExpenseData,
    getExpensesError,
    getRecurringExpensesError,
    refetchExpenses,
    insertNewExpense,
    insertNewRecurringExpense,
    insertNewExpenseAndReturn,
    updateExpense,
    deleteExpense,
  };
};

export default useExpenses;
