export function VerifyEmailPage() {
  return (
    <div className="w-full max-w-xs px-4">
      <h1 className="mb-2 font-medium text-sm">Verify your email</h1>
      <p className="text-muted-foreground text-left text-xs/relaxed leading-normal font-normal text-balance last:mt-0 nth-last-2:-mt-1 [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4">
        We've sent a link to your email to verify your email. Please check your
        email and click the link to verify your email.
      </p>
    </div>
  );
}
