import { Button } from "@blehprint/ui/components/button";
import { FieldDescription, FieldLegend } from "@blehprint/ui/components/field";

const copy = {
  verify:
    "We sent you a link to verify your email address. Open it to finish creating your account.",
  reset: "If an account exists for that address, we sent it a link to choose a new password.",
};

export function CheckEmailPage({ reason }: { reason: keyof typeof copy }) {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3 px-4">
      <FieldLegend>Check your email</FieldLegend>
      <FieldDescription>{copy[reason]}</FieldDescription>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          nativeButton={false}
          render={<a href="https://mail.google.com" />}
        >
          Open Gmail
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<a href="https://outlook.live.com" />}
        >
          Open Outlook
        </Button>
      </div>
    </div>
  );
}
