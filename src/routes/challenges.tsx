import { createFileRoute } from "@tanstack/react-router";
import Challenges from "../pages/challenges";

export const Route = createFileRoute("/challenges")({
  component: Challenges,
});
