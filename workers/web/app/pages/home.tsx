import type { SessionData } from "@blehprint/auth";
import { Button } from "@blehprint/ui/components/button";
import { Link } from "react-router";

export function HomePage({ session }: { session: SessionData }) {
  const isLoggedIn = session !== null;

  return (
    <main className="flex flex-col gap-2 items-center justify-center min-h-svh">
      <h1>Welcome to Blehprint</h1>

      {isLoggedIn && (
        <div className="flex gap-1 flex-col">
          <p className="text-sm text-muted-foreground mb-2">
            Signed in as: <strong>{session.user.name}</strong>.
          </p>
          <Button nativeButton={false} render={<Link to="/auth/logout" />}>
            Logout
          </Button>
        </div>
      )}

      {!isLoggedIn && (
        <div className="flex gap-1">
          <Button nativeButton={false} render={<Link to="/auth/login" />}>
            Login
          </Button>
          <Button nativeButton={false} render={<Link to="/auth/signup" />}>
            Sign Up
          </Button>
        </div>
      )}
    </main>
  );
}
