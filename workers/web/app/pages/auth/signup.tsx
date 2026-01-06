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

export const signupSchema = z.object({
  name: z.string("Name is required"),
  email: z.email("Email is invalid"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z
    .string("Confirm password is required")
    .min(8, "Confirm password must be at least 8 characters"),
});

export function SignUpPage() {
  const lastResult = useActionData();
  const isPending = useIsPending();

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    constraint: getZodConstraint(signupSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signupSchema });
    },
  });

  return (
    <Form
      {...getFormProps(form)}
      method="POST"
      action="/auth/signup"
      className="w-full max-w-xs px-4"
    >
      <FieldSet>
        <FieldLegend>Sign Up</FieldLegend>
        <FieldDescription>Create an account to continue.</FieldDescription>
        <FieldSeparator />
        {form.errors && <FieldError>{form.errors}</FieldError>}
        <FieldGroup>
          <Field data-invalid={!!fields.name.errors}>
            <FieldLabel htmlFor={fields.name.id}>Name</FieldLabel>
            <Input
              {...getInputProps(fields.name, { type: "text" })}
              aria-invalid={!!fields.name.errors}
              placeholder="Enter your name"
              enterKeyHint="next"
            />
            {fields.name.errors && (
              <FieldError>{fields.name.errors}</FieldError>
            )}
          </Field>
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
        </FieldGroup>
        <FieldGroup>
          <Field data-invalid={!!fields.password.errors}>
            <FieldLabel htmlFor={fields.password.id}>Password</FieldLabel>
            <Input
              {...getInputProps(fields.password, { type: "password" })}
              aria-invalid={!!fields.password.errors}
              placeholder="Enter your password"
              autoComplete="current-password"
              enterKeyHint="done"
            />
            {fields.password.errors && (
              <FieldError>{fields.password.errors}</FieldError>
            )}
          </Field>
          <Field data-invalid={!!fields.confirmPassword.errors}>
            <FieldLabel htmlFor={fields.confirmPassword.id}>
              Confirm Password
            </FieldLabel>
            <Input
              {...getInputProps(fields.confirmPassword, { type: "password" })}
              aria-invalid={!!fields.confirmPassword.errors}
              placeholder="Confirm your password"
              autoComplete="new-password"
              enterKeyHint="done"
            />
            {fields.confirmPassword.errors && (
              <FieldError>{fields.confirmPassword.errors}</FieldError>
            )}
          </Field>
        </FieldGroup>

        <Field orientation="horizontal">
          <FieldDescription>
            By clicking continue, you agree to our{" "}
            <a href="/" className="text-primary hover:underline">
              Terms of Service
            </a>
            {" and "}
            <a href="/" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </FieldDescription>
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
              "Sign Up"
            )}
          </Button>
        </Field>
      </FieldSet>
    </Form>
  );
}
