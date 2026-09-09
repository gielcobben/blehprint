import { Button } from "@blehprint/ui/components/button";
import { FieldDescription, FieldLegend } from "@blehprint/ui/components/field";
import { Link } from "react-router";

/** Shown only when verification failed; a valid link redirects to login. */
export function VerifyEmailPage() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3 px-4">
      <FieldLegend>This link has expired</FieldLegend>
      <FieldDescription>
        The verification link is invalid or has already been used. Sign up again to get a new one,
        or log in if your email is already verified.
      </FieldDescription>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" nativeButton={false} render={<Link to="/auth/signup" />}>
          Sign up
        </Button>
        <Button nativeButton={false} render={<Link to="/auth/login" />}>
          Log in
        </Button>
      </div>
    </div>
  );
}
