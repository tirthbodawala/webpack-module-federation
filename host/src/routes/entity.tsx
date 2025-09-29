import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const App2 = lazy(() => import("app2/App").then(m => ({ default: m.App})));

export const Route = createFileRoute("/entity")({
  component: Entity,
});

function Entity() {
  return (
    <div className="p-2">
      <h3>Welcome To Entity!</h3>
      <App2 />
    </div>
  );
}
