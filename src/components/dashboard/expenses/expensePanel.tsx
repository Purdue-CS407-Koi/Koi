import { ExpenseTable } from "./expenseTable";
import { NewExpenseModal } from "./newExpenseModal";

export const ExpensePanel = () => {
  return (
    <div className="flex-4 p-5 bg-white rounded-lg flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <p className="text-xl font-medium">Expenses</p>
        <NewExpenseModal />
      </div>
      <ExpenseTable />
    </div>
  );
};
