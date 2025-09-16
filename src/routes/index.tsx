import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "../pages/dashboard";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Dashboard />
    </div>
  );
}
