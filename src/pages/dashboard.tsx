import { ExpenseTable } from "../components/dashboard/expenseTable";
import useExpenses from "../hooks/useExpenses";
import type { NewExpense } from "../interfaces/Expense";
import { useBucketsStore } from "../stores/useBucketsStore";

export const Dashboard = () => {
  const currentBucketInstanceId = useBucketsStore(
    (state) => state.currentBucketInstanceId
  );

  const { insertNewExpense } = useExpenses();

  const handleTestAddNewExpense = () => {
    const newExpense: NewExpense = {
      amount: 100,
      description: "Rent for September",
      name: "Apartment rent",
      bucket_instance_id: currentBucketInstanceId,
    };
    insertNewExpense(newExpense);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 10,
        justifyItems: "space-between",
      }}
    >
      <button onClick={handleTestAddNewExpense}>Test adding new expense</button>
      <div
        style={{
          margin: 20,
          backgroundColor: "white",
          padding: 20,
          borderRadius: 10,
        }}
      >
        <p>Expenses</p>
        <ExpenseTable />
      </div>
    </div>
  );
};
