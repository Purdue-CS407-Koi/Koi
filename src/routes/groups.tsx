import { createFileRoute } from "@tanstack/react-router";
import Template, { Content, Sidebar} from '../templates/template'

export const Route = createFileRoute('/groups')({
  component: Groups,
})

function Groups() {
  return (
    <Template>
      <Content>Hello from Groups!</Content>
      <Sidebar>Sidebar content for groups</Sidebar>
    </Template>
  );
}
