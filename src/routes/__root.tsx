
import { createRootRoute, Outlet, Navigate, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "../stores/useAuthStore";

const RootLayout = () => {
  const { user } = useAuthStore();
  const path = useRouterState().location.pathname.toLowerCase();
  if (!user && path !== "/signIn".toLowerCase() && path !== "/signUp".toLowerCase()) {
    return <Navigate to="/signIn" replace />;
  }

  return (
    <>
      <Outlet />
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
