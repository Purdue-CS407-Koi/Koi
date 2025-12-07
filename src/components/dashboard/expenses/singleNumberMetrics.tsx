import { calculateExpenseStats } from "@/helpers/utilities";
import useExpenses from "@/hooks/useExpenses";

export const SingleNumberMetrics = () => {
  const { expenseData } = useExpenses();
  const { averageDailySpending, averageExpenseSize, largestExpense } =
    calculateExpenseStats(expenseData!);

  return (
    <div className="flex flex-col gap-3">
      <p>
        <strong>Average Daily Spending:</strong> ${averageDailySpending}{" "}
      </p>
      <p>
        <strong>Average Expense Size:</strong> ${averageExpenseSize}
      </p>
      <p>
        <strong>Largest Expense:</strong>{" "}
        {largestExpense == null ? "N/A" : largestExpense.name}
      </p>
    </div>
  );
};
