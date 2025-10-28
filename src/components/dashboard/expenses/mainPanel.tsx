import { BudgetPanel } from "./budgetPanel";
import { ExpensePanel } from "./expensePanel";
import { Divider } from "@mui/material";

export const MainPanel = () => {
  return (
    <div className="flex flex-row bg-white m-5 rounded-lg">
      <ExpensePanel />
      <Divider orientation="vertical" variant="middle" flexItem />
      <BudgetPanel />
    </div>
  );
};
