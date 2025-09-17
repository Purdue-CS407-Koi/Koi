import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const RootLayout = () => (
  <>
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Dashboard
      </Link>{" "}
      <Link to="/groups" className="[&.active]:font-bold">
        Groups
      </Link>{" "}
      <Link to="/challenges" className="[&.active]:font-bold">
        Challenges
      </Link>{" "}
      <Link to="/forum" className="[&.active]:font-bold">
        Forum
      </Link>
    </div>
    <hr />
    <Outlet />
    <ReactQueryDevtools />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
