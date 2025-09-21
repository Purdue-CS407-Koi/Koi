import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Template, { Content, Sidebar } from "../templates/template";
import { GroupsExpense } from "../pages/groupsExpense";
import { GroupsList } from "../components/groups/groupsList";

// TODO: change to fetch from DB
interface Group {
  id: string;
  name: string;
  createdDate: string;
  type?: 'default' | 'trip';
}

export const Route = createFileRoute("/groups")({
  component: Groups,
});

function Groups() {
  const [groups] = useState<Group[]>([
    { id: '1', name: 'NYC Trip', createdDate: 'July 15 2025', type: 'trip' },
    { id: '2', name: 'Roommates', createdDate: 'Feb 10 2025' },
    { id: '3', name: 'Non-group Expenses', createdDate: '', type: 'default' }
  ]);

  const handleAddGroup = () => {
    console.log("Add new group");
  };

  return (
    <Template>
      <Content>
        <GroupsExpense />
      </Content>
      <Sidebar>
        <GroupsList groups={groups} onAddGroup={handleAddGroup} />
      </Sidebar>
    </Template>
  );
}
