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

export const loginSchema = z.object({
  email: z.email("Email is invalid"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export function LoginPage() {
  const lastResult = useActionData();
  const isPending = useIsPending();

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    constraint: getZodConstraint(loginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },
  });

  return (
    <Form
      {...getFormProps(form)}
      method="POST"
      action="/auth/login"
      className="w-full max-w-xs px-4"
    >
      <FieldSet>
        <FieldLegend>Sign In</FieldLegend>
        <FieldDescription>
          Sign in to your account to continue.
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
              defaultValue="g.cobben@gmail.com"
            />
            {fields.email.errors && (
              <FieldError>{fields.email.errors}</FieldError>
            )}
          </Field>
          <Field data-invalid={!!fields.password.errors}>
            <FieldLabel htmlFor={fields.password.id}>Password</FieldLabel>
            <Input
              {...getInputProps(fields.password, { type: "password" })}
              aria-invalid={!!fields.password.errors}
              placeholder="Enter your password"
              autoComplete="current-password"
              enterKeyHint="done"
              defaultValue="helloworld"
            />
            {fields.password.errors && (
              <FieldError>{fields.password.errors}</FieldError>
            )}
          </Field>

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
                "Sign In"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Form>
  );
}
