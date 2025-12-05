import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  UpdateExpenseProps,
  UpdateRecurringExpenseProps,
} from "@/interfaces/Expense";
import {
  insertNewExpense as insertNewExpenseApi,
  insertNewExpenseComment as insertNewExpenseCommentApi,
  insertNewRecurringExpense as insertNewRecurringExpenseApi,
  getExpensesFromBucket,
  getRecurringExpenses,
  getExpenseComments,
  updateExpense as updateExpenseApi,
  updateRecurringExpense as updateRecurringExpenseApi,
  deleteExpense as deleteExpenseApi,
  deleteRecurringExpense as deleteRecurringExpenseApi,
  deleteExpenseComment as deleteExpenseCommentApi,
} from "@/api/expenses";
import { useBucketsStore } from "@/stores/useBucketsStore";
import { useExpenseStore } from "@/stores/useExpenseStore";
import type { TablesInsert } from "@/helpers/supabase.types";
import {
  convertToLocalTime,
  convertToLocalTimeFull,
} from "@/helpers/utilities";

const useExpenses = () => {
  const currentBucketInstanceId = useBucketsStore(
    (state) => state.currentBucketInstanceId
  );

  const currentBucketMetadataId = useBucketsStore(
    (state) => state.currentBucketMetadataId
  );

  const currentExpenseId = useExpenseStore((state) => state.currentExpenseId);

  const createExpenseMutation = useMutation({
    mutationFn: insertNewExpenseApi,
    onError: (err) => {
      console.log("error inserting new expense: " + JSON.stringify(err));
    },
    onSuccess: () => {
      refetchExpenses();
    },
  });

  const createExpenseCommentMutation = useMutation({
    mutationFn: insertNewExpenseCommentApi,
    onError: (err) => {
      console.log(
        "error inserting new expense comment: " + JSON.stringify(err)
      );
    },
    onSuccess: () => {
      refetchExpenseComments();
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

  const deleteExpenseCommentMutation = useMutation({
    mutationFn: deleteExpenseCommentApi,
    onError: (err) => {
      console.log("error deleting expense comment: " + JSON.stringify(err));
    },
    onSuccess: () => {
      refetchExpenseComments();
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

  const {
    data: expenseComments,
    error: getExpensesCommentsError,
    refetch: refetchExpenseComments,
  } = useQuery({
    queryKey: ["expenseComments", currentExpenseId],
    queryFn: async () => {
      if (!currentExpenseId) {
        return [];
      }

      const rawData = await getExpenseComments(currentExpenseId);
      return rawData?.map((item) => ({
        ...item,
        created_at: convertToLocalTimeFull(item.created_at),
      }));
    },
  });

  const insertNewExpense = (expense: TablesInsert<"Expenses">) => {
    createExpenseMutation.mutate(expense);
  };

  const insertNewExpenseComment = (
    expense: TablesInsert<"ExpenseComments">
  ) => {
    createExpenseCommentMutation.mutate(expense);
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

  const deleteExpenseComment = (id: string) => {
    deleteExpenseCommentMutation.mutate(id);
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
    expenseComments,
    getExpensesCommentsError,
    refetchExpenses,
    insertNewExpense,
    insertNewExpenseComment,
    insertNewRecurringExpense,
    insertNewExpenseAndReturn,
    updateExpense,
    updateRecurringExpense,
    deleteExpense,
    deleteExpenseComment,
    deleteRecurringExpense,
    createRecurringExpensesForNewBucketInstance,
  };
};

export default useExpenses;
