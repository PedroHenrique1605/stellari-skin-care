import { createFileRoute, redirect } from "@tanstack/react-router";

// Alias route: /Admin (capital A) redirects to /admin
export const Route = createFileRoute("/Admin")({
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
});
