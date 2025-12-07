import useExpenses from "@/hooks/useExpenses";
import { NewRecurringExpenseModal } from "./modals/newRecurringExpenseModal";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { EditRecurringExpenseModal } from "./modals/editRecurringExpenseModal";
import { DeleteRecurringExpenseModal } from "./modals/deleteRecurringExpenseModal";

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
      <div className="h-[140px] overflow-auto">
        {recurringExpenseData?.map((expense) => {
          return (
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-1 self-center w-1/2">
                <ChevronRightIcon />
                <p className="self-center">{expense.name}</p>
              </div>
              <div className="flex flex-row justify-between w-1/2">
                <p className="self-center">${expense.amount}</p>
                <div className="flex flex-row">
                  <EditRecurringExpenseModal expenseData={expense} />
                  <DeleteRecurringExpenseModal expenseData={expense} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
