import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { HeaderMegaMenu } from "design/Header";

console.log(HeaderMegaMenu);

const RootLayout = () => (
  <>
    <HeaderMegaMenu />
    <Outlet />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
