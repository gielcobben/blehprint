import type { User } from "@blehprint/database";
import { Button } from "@blehprint/ui/components/button";
import { useState } from "react";

export function HomePage({ users }: { users: User[] }) {
  const [count, setCount] = useState(0);
  return (
    <main className="flex flex-col gap-2 items-center justify-center min-h-svh">
      <h1>Welcome to Blehprint</h1>

      <Button onClick={() => setCount(count + 1)}>{count} Clicks</Button>

      <div className="text-xs text-neutral-400">
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.id}</li>
            ))}
          </ul>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </main>
  );
}
