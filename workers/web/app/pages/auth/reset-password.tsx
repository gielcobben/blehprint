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
    password: z.string("Password is required").min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string("Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPasswordPage() {
  const lastResult = useActionData();
  const isPending = useIsPending();

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    constraint: getZodConstraint(resetPasswordSchema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema: resetPasswordSchema }),
  });

  return (
    <Form {...getFormProps(form)} method="POST" className="w-full max-w-xs px-4">
      <FieldSet>
        <FieldLegend>Reset password</FieldLegend>
        <FieldDescription>Choose a new password for your account.</FieldDescription>
        <FieldSeparator />

        {form.errors ? <FieldError>{form.errors}</FieldError> : null}

        <FieldGroup>
          <Field data-invalid={!!fields.password.errors}>
            <FieldLabel htmlFor={fields.password.id}>New password</FieldLabel>
            <Input
              {...getInputProps(fields.password, { type: "password" })}
              aria-invalid={!!fields.password.errors}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              enterKeyHint="next"
            />
            {fields.password.errors ? <FieldError>{fields.password.errors}</FieldError> : null}
          </Field>
          <Field data-invalid={!!fields.confirmPassword.errors}>
            <FieldLabel htmlFor={fields.confirmPassword.id}>Confirm new password</FieldLabel>
            <Input
              {...getInputProps(fields.confirmPassword, { type: "password" })}
              aria-invalid={!!fields.confirmPassword.errors}
              autoComplete="new-password"
              placeholder="Repeat your new password"
              enterKeyHint="done"
            />
            {fields.confirmPassword.errors && (
              <FieldError>{fields.confirmPassword.errors}</FieldError>
            )}
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field orientation="horizontal" className="grid grid-cols-2 gap-2">
            <Button
              disabled={isPending}
              nativeButton={false}
              variant="outline"
              render={<Link to="/auth/login" />}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "Reset password"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Form>
  );
}
