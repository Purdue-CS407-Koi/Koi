import { ExpenseTable } from "./expenseTable";
import { NewExpenseModal } from "./newExpenseModal";

export const ExpensePanel = () => {
  return (
    <div className="flex flex-col p-5 justify-between">
      <div className="m-5 bg-white p-5 rounded-lg flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <p className="text-xl font-medium self-center">Expenses</p>
          <NewExpenseModal />
        </div>
        <ExpenseTable />
      </div>
    </div>
  );
};
