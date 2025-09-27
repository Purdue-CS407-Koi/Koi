import { Dashboard } from "../pages/dashboard";
import Template, { Content, Sidebar } from "../templates/template";
import { BucketsList } from "../components/dashboard/bucketsList";
import { useState } from "react";
import type Bucket from "../interfaces/Bucket";
import { RecurrencePeriodType } from "../interfaces/Bucket";

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
        <Dashboard />
      </Content>
      <Sidebar>
        <BucketsList buckets={buckets} onAddBucket={handleAddBucket} />
      </Sidebar>
    </Template>
  );
};

export default Index;
