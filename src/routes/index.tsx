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
        <Dashboard />
      </Content>
      <Sidebar>Sidebar content for dashboard</Sidebar>
    </Template>
  );
}
