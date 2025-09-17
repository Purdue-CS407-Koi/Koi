import { createFileRoute } from '@tanstack/react-router'
import Template, { Content, Sidebar} from '../templates/template'

export const Route = createFileRoute('/forum')({
  component: Forum,
})

function Forum() {
  return (
    <Template>
      <Content>Hello from Forum!</Content>
      <Sidebar>Sidebar content</Sidebar>
    </Template>
  );
}
