import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "../pages/dashboard";
import Template, { Content, Sidebar } from "../templates/template";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Template>
      <Content>
        <div className="p-2">
          <h3>Welcome Home!</h3>
          <Dashboard />
        </div>
      </Content>
      <Sidebar>Sidebar content for dashboard</Sidebar>
    </Template>
  );
}
