import { Button } from "@blehprint/ui/components/button";
import { Link } from "react-router";
import type { Session } from "~/utils/auth.server";

export function HomePage({ session }: { session: Session | null }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="font-medium text-lg">Welcome to Blehprint</h1>

      {session ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-muted-foreground text-sm">
            Signed in as <strong>{session.user.name}</strong>
          </p>
          <Button nativeButton={false} render={<Link to="/auth/logout" />}>
            Log out
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button nativeButton={false} render={<Link to="/auth/login" />}>
            Log in
          </Button>
          <Button nativeButton={false} variant="outline" render={<Link to="/auth/signup" />}>
            Sign up
          </Button>
        </div>
      )}
    </main>
  );
}
