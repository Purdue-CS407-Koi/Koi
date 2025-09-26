import { useMutation } from "@tanstack/react-query";
import type { NewExpense } from "../interfaces/Expense";
import { insertNewExpense as insertNewExpenseApi } from "../api/expenses";

const useExpenses = () => {
  const mutation = useMutation({
    mutationFn: insertNewExpenseApi,
    onError: (err) => {
      console.log("error inserting new expense: " + JSON.stringify(err));
    },
  });

  const insertNewExpense = (expense: NewExpense) => {
    mutation.mutate(expense);
  };

  return { insertNewExpense };
};

export default useExpenses;
