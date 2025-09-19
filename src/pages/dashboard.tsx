import useBucketInstances from "../hooks/useBucketInstances";
//import { useBucketInstanceStore } from "../stores/useBucketInstanceStore";
import { ExpenseTable } from "../components/dashboard/expenseTable";

export const Dashboard = () => {
  const { bucketData, isLoading, error } = useBucketInstances();
  //   const currentBucketInstanceId = useBucketInstanceStore(
  //     (state) => state.currentBucketInstanceId
  //   );
  //   const setCurrentBucketInstanceId = useBucketInstanceStore(
  //     (state) => state.setCurrentBucketInstanceId
  //   );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 10,
        justifyItems: "space-between",
      }}
    >
      <p>The current bucket is: {bucketData!.id}</p>
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
