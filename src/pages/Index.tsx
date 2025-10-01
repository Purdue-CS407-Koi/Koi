import { useState } from "react";

import Template, { Content, Sidebar } from "@/templates/template";

import type {Bucket} from "@/interfaces/Bucket";
import { RecurrencePeriodType } from "@/interfaces/Bucket";
import { ExpenseTable } from "@/components/dashboard/expenses/expenseTable";
import { BucketsList } from "@/components/dashboard/bucketsList";
import { NewExpenseModal } from "@/components/dashboard/expenses/newExpenseModal";

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

  return (
    <Template>
      <Content>
        <div className="flex flex-col p-5 justify-between">
          <NewExpenseModal />
          <div className="m-5 bg-white p-5 rounded-lg flex flex-col gap-4">
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
