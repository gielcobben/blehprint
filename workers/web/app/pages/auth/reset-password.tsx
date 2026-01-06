import { Button } from "@blehprint/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@blehprint/ui/components/field";
import { Input } from "@blehprint/ui/components/input";
import { Spinner } from "@blehprint/ui/components/spinner";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { Form, Link, useActionData } from "react-router";
import z from "zod";
import { useIsPending } from "~/utils/form";

export const resetPasswordSchema = z
  .object({
    token: z.string("Token is required"),
    newPassword: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z
      .string("Confirm password is required")
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export function ResetPasswordPage({ token }: { token: string }) {
  const lastResult = useActionData();
  const isPending = useIsPending();

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    constraint: getZodConstraint(resetPasswordSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: resetPasswordSchema });
    },
  });

  return (
    <Form
      {...getFormProps(form)}
      method="POST"
      action={`/auth/reset-password/${token}`}
      className="w-full max-w-xs px-4"
    >
      <input
        {...getInputProps(fields.token, { type: "hidden" })}
        value={token}
        readOnly
      />
      <FieldSet>
        <FieldLegend>Reset Password</FieldLegend>
        <FieldDescription>
          Enter your new password to reset your password.
        </FieldDescription>
        <FieldSeparator />
        {form.errors && <FieldError>{form.errors}</FieldError>}
        <FieldGroup>
          <Field data-invalid={!!fields.newPassword.errors}>
            <FieldLabel htmlFor={fields.newPassword.id}>
              New Password
            </FieldLabel>
            <Input
              {...getInputProps(fields.newPassword, { type: "password" })}
              aria-invalid={!!fields.newPassword.errors}
              placeholder="Enter your new password"
              autoComplete="new-password"
              enterKeyHint="done"
            />
            {fields.newPassword.errors && (
              <FieldError>{fields.newPassword.errors}</FieldError>
            )}
          </Field>
          <Field data-invalid={!!fields.confirmNewPassword.errors}>
            <FieldLabel htmlFor={fields.confirmNewPassword.id}>
              Confirm New Password
            </FieldLabel>
            <Input
              {...getInputProps(fields.confirmNewPassword, {
                type: "password",
              })}
              aria-invalid={!!fields.confirmNewPassword.errors}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              enterKeyHint="done"
            />
            {fields.confirmNewPassword.errors && (
              <FieldError>{fields.confirmNewPassword.errors}</FieldError>
            )}
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field orientation="horizontal" className="grid grid-cols-2 gap-2">
            <Button
              disabled={isPending}
              nativeButton={false}
              variant="outline"
              render={<Link to="/" />}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Spinner className="size-4 animate-spin" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Form>
  );
}
