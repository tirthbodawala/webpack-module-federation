import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const App1 = lazy(() => import("app1/App").then(m => ({ default: m.App})));

export const Route = createFileRoute("/masters")({
  component: App1,
});
