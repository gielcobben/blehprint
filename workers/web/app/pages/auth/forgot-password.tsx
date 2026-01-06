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
import { Form, href, Link, useActionData } from "react-router";
import z from "zod";
import { useIsPending } from "~/utils/form";

export const forgotPasswordSchema = z.object({
  email: z.email("Email is invalid"),
});

export function ForgotPasswordPage() {
  const lastResult = useActionData();
  const isPending = useIsPending();

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    constraint: getZodConstraint(forgotPasswordSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: forgotPasswordSchema });
    },
  });

  return (
    <Form
      {...getFormProps(form)}
      method="POST"
      action="/auth/forgot-password"
      className="w-full max-w-xs px-4"
    >
      <FieldSet>
        <FieldLegend>Forgot Password</FieldLegend>
        <FieldDescription>
          Enter your email to reset your password.
        </FieldDescription>
        <FieldSeparator />
        {form.errors && <FieldError>{form.errors}</FieldError>}
        <FieldGroup>
          <Field data-invalid={!!fields.email.errors}>
            <FieldLabel htmlFor={fields.email.id}>Email</FieldLabel>
            <Input
              {...getInputProps(fields.email, { type: "email" })}
              aria-invalid={!!fields.email.errors}
              placeholder="Enter your email"
              enterKeyHint="next"
            />
            {fields.email.errors && (
              <FieldError>{fields.email.errors}</FieldError>
            )}
          </Field>
          <Field orientation="horizontal" className="grid grid-cols-2 gap-2">
            <Button
              disabled={isPending}
              nativeButton={false}
              variant="outline"
              render={<Link to={href("/auth/login")} />}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Spinner className="size-4 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Form>
  );
}
