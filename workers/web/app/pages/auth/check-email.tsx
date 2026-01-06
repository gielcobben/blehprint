import { Button } from "@blehprint/ui/components/button";
import { Link } from "react-router";

export function CheckEmailPage() {
  return (
    <div className="w-full max-w-xs px-4">
      <h1 className="mb-2 font-medium text-sm">Check your email</h1>
      <p className="text-muted-foreground text-left text-xs/relaxed leading-normal font-normal text-balance last:mt-0 nth-last-2:-mt-1 [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4">
        We've sent a link to your email to reset your password. Please check
        your email and click the link to reset your password.
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1">
        <Button render={<Link to="https://mail.google.com" />}>
          Open Gmail
        </Button>
        <Button render={<Link to="https://outlook.live.com" />}>
          Open Outlook
        </Button>
      </div>
    </div>
  );
}
