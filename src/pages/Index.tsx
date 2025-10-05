import Template, { Content, Sidebar } from "@/templates/template";

import { ExpenseTable } from "@/components/dashboard/expenses/expenseTable";
import { BucketList } from "@/components/dashboard/buckets/BucketList";
import { NewExpenseModal } from "@/components/dashboard/expenses/newExpenseModal";

const Index = () => {
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
        <BucketList />
      </Sidebar>
    </Template>
  );
};

export default Index;
