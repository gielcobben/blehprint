import type { User } from "@blehprint/database";

export function HomePage({ users }: { users: User[] }) {
  return (
    <main className="flex flex-col gap-2 items-center justify-center min-h-svh">
      <h1>Welcome to Blehprint</h1>

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
