import { createFileRoute } from '@tanstack/react-router'
import Template, { Content, Sidebar} from '../templates/template'

export const Route = createFileRoute('/challenges')({
  component: Challenges,
})

function Challenges() {
  return (
    <Template>
      <Content>Hello from Challenges!</Content>
      <Sidebar>Sidebar content</Sidebar>
    </Template>
  );
}
