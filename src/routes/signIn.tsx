import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "../pages/signIn";

export const Route = createFileRoute("/signIn")({
  component: SignInRoute,
});

function SignInRoute() {
  return (
    <div className="p-2">
      <SignInPage />
    </div>
  );
}