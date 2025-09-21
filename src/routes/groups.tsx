import { createFileRoute } from "@tanstack/react-router";
import Template, { Content, Sidebar } from "../templates/template";
import { GroupsExpense } from "../pages/groupsExpense";

export const Route = createFileRoute("/groups")({
  component: Groups,
});

function Groups() {
  return (
    <Template>
      <Content>
        <GroupsExpense />
      </Content>
      <Sidebar>Sidebar content for groups</Sidebar>
    </Template>
  );
}
