import { useState } from "react";

import Template, { Content, Sidebar } from "@/templates/template";

import type Bucket from "@/interfaces/Bucket";
import type { NewExpense } from "@/interfaces/Expense";
import { RecurrencePeriodType } from "@/interfaces/Bucket";
import { ExpenseTable } from "@/components/dashboard/expenseTable";
import { BucketsList } from "@/components/dashboard/bucketsList";
import useExpenses from "@/hooks/useExpenses";
import { useBucketsStore } from "@/stores/useBucketsStore";

const Index = () => {
  // TODO: change to fetch from DB
  const [buckets] = useState<Bucket[]>([
    {
      id: "1",
      name: "Dining",
      recurrence_period_type: RecurrencePeriodType.Monthly,
      spending_limit: 15000,
    },
    {
      id: "2",
      name: "Entertainment",
      recurrence_period_type: RecurrencePeriodType.Weekly,
      spending_limit: 2000,
    },
  ]);

  const handleAddBucket = () => {
    console.log("Add new bucket");
  };

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
    <Template>
      <Content>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 10,
            justifyItems: "space-between",
          }}
        >
          <button onClick={handleTestAddNewExpense}>
            Test adding new expense
          </button>
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
      </Content>
      <Sidebar>
        <BucketsList buckets={buckets} onAddBucket={handleAddBucket} />
      </Sidebar>
    </Template>
  );
};

export default Index;
