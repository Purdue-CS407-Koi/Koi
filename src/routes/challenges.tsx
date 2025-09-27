import { createFileRoute } from "@tanstack/react-router";
import Challenges from "../pages/Challenges";

export const Route = createFileRoute("/challenges")({
  component: Challenges,
});
