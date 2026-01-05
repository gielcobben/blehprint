import { Outlet } from "react-router";
import type { Route } from "./+types/layout";

export default function AuthLayout({}: Route.ComponentProps) {
  return (
    <main className="flex flex-col items-center justify-center min-h-svh">
      <Outlet />
    </main>
  );
}
