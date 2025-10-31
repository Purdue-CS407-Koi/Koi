import useExpenses from "@/hooks/useExpenses";
import { NewRecurringExpenseModal } from "./newRecurringExpenseModal";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export const RecurringExpensesSection = () => {
  const { recurringExpenseData } = useExpenses();
  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex flex-row justify-between">
        <p className="flex self-center font-medium text-lg">
          Recurring Expenses
        </p>
        <NewRecurringExpenseModal />
      </div>
      {recurringExpenseData?.map((expense) => {
        return (
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-1">
              <ChevronRightIcon />
              <p className="self-center">{expense.name}</p>
            </div>
            <p className="self-center">${expense.amount}</p>
          </div>
        );
      })}
    </div>
  );
};
