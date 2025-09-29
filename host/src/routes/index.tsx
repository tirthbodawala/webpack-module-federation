import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "design/Hero";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Hero title={"Crisil <> SBI"} description={"This is a new start of CLMM with Crisil <> SBI"} />
  );
}
