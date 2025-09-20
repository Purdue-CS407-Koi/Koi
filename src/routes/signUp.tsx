import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "../pages/signUp";

export const Route = createFileRoute("/signUp")({
  component: SignUpRoute,
});

function SignUpRoute() {
  return <SignUpPage />;
}
