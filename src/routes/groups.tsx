import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/groups")({
  component: Groups,
});

function Groups() {
  return <div className="p-2">Hello from Groups!</div>;
}
