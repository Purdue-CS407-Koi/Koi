import Template, { Content, Sidebar } from "@/templates/template";
import { BucketList } from "@/components/dashboard/buckets/BucketList";
import { ExpensePanel } from "@/components/dashboard/expenses/expensePanel";

const Index = () => {
  return (
    <Template>
      <Content>
        <ExpensePanel />
      </Content>
      <Sidebar>
        <BucketList />
      </Sidebar>
    </Template>
  );
};

export default Index;
