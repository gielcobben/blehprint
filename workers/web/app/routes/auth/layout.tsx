import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center">
      <Outlet />
    </main>
  );
}
