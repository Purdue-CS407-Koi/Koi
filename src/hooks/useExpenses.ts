import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  UpdateExpenseProps,
  UpdateRecurringExpenseProps,
} from "@/interfaces/Expense";
import {
  insertNewExpense as insertNewExpenseApi,
  insertNewRecurringExpense as insertNewRecurringExpenseApi,
  getExpensesFromBucket,
  getRecurringExpenses,
  updateExpense as updateExpenseApi,
  updateRecurringExpense as updateRecurringExpenseApi,
  deleteExpense as deleteExpenseApi,
  deleteRecurringExpense as deleteRecurringExpenseApi,
} from "@/api/expenses";
import { useBucketsStore } from "@/stores/useBucketsStore";
import type { TablesInsert } from "@/helpers/supabase.types";
import { convertToLocalTime } from "@/helpers/utilities";

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
      console.log("error updating expense: " + JSON.stringify(err));
    },
    onSuccess: () => {
      refetchExpenses();
    },
  });

  const updateRecurringExpenseMutation = useMutation({
    mutationFn: updateRecurringExpenseApi,
    onError: (err) => {
      console.log("error updating recurring expense: " + JSON.stringify(err));
    },
    onSuccess: () => {
      refetchRecurringExpenses();
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpenseApi,
    onError: (err) => {
      console.log("error deleting expense: " + JSON.stringify(err));
    },
    onSuccess: () => {
      refetchExpenses();
    },
  });

  const deleteRecurringExpenseMutation = useMutation({
    mutationFn: deleteRecurringExpenseApi,
    onError: (err) => {
      console.log("error deleting recurring expense: " + JSON.stringify(err));
    },
    onSuccess: () => {
      refetchRecurringExpenses();
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
        created_at: convertToLocalTime(item.created_at),
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
        created_at: convertToLocalTime(item.created_at),
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

  const updateRecurringExpense = (expense: UpdateRecurringExpenseProps) => {
    updateRecurringExpenseMutation.mutate(expense);
  };

  const deleteExpense = (id: string) => {
    deleteExpenseMutation.mutate(id);
  };

  const deleteRecurringExpense = (id: string) => {
    deleteRecurringExpenseMutation.mutate(id);
  };

  const createRecurringExpensesForNewBucketInstance = (
    bucket_instance_id: string
  ) => {
    recurringExpenseData?.map((expense) => {
      insertNewExpense({
        amount: expense.amount!,
        name: expense.name!,
        description: expense.description,
        bucket_instance_id,
      });
    });
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
    updateRecurringExpense,
    deleteExpense,
    deleteRecurringExpense,
    createRecurringExpensesForNewBucketInstance,
  };
};

export default useExpenses;
