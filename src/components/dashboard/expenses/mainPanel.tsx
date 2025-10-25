import { BudgetPanel } from "./budgetPanel";
import { ExpensePanel } from "./expensePanel";

export const MainPanel = () => {
  return (
    <div className="flex flex-row gap-2 bg-white m-5 rounded-lg">
      <ExpensePanel />
      <BudgetPanel />
    </div>
  );
};
