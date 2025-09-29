import { createRouter, RouterProvider } from "@tanstack/react-router";
import { lazy } from "react";

const SharedProvider = lazy(
  () => import("shared/Provider").then((d) => ({ default: d.SharedProvider})),
);
const DesignProvider = lazy(
  () => import("design/provider").then((d) => ({ default: d.DesignProvider})),
)
import { routeTree } from "./routeTree.gen";
import { ErrorBoundary } from "react-error-boundary";


const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  Wrap: ({ children }) => (
    <ErrorBoundary fallback="An error occurred while loading the application.">
      <SharedProvider value={{ name: "SBI" }}>
        <DesignProvider theme="sbi">
          {children}
        </DesignProvider>
      </SharedProvider>
    </ErrorBoundary>
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
