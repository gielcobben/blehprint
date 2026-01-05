import type { User } from "@blehprint/database";
import { Button } from "@blehprint/ui/components/button";
import { useState } from "react";
import { Link } from "react-router";

export function HomePage({ users }: { users: User[] }) {
  const [count, setCount] = useState(0);
  return (
    <main className="flex flex-col gap-2 items-center justify-center min-h-svh">
      <h1>Welcome to Blehprint</h1>

      <div className="flex gap-1">
        <Button render={<Link to="/auth/login" />}>Login</Button>
        <Button render={<Link to="/auth/signup" />}>Sign Up</Button>
      </div>
    </main>
  );
}
