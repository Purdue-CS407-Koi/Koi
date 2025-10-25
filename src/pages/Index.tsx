import Template, { Content, Sidebar } from "@/templates/template";
import { BucketList } from "@/components/dashboard/buckets/BucketList";
import { MainPanel } from "@/components/dashboard/expenses/mainPanel";

const Index = () => {
  return (
    <Template>
      <Content>
        <MainPanel />
      </Content>
      <Sidebar>
        <BucketList />
      </Sidebar>
    </Template>
  );
};

export default Index;
