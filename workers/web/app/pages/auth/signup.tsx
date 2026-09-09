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

export const signupSchema = z
  .object({
    name: z.string("Name is required").min(1, "Name is required"),
    email: z.email("Enter a valid email address"),
    password: z.string("Password is required").min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string("Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignupPage() {
  const lastResult = useActionData();
  const isPending = useIsPending();

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    constraint: getZodConstraint(signupSchema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema: signupSchema }),
  });

  return (
    <Form {...getFormProps(form)} method="POST" className="w-full max-w-xs px-4">
      <FieldSet>
        <FieldLegend>Sign up</FieldLegend>
        <FieldDescription>Create an account to continue.</FieldDescription>
        <FieldSeparator />

        {form.errors ? <FieldError>{form.errors}</FieldError> : null}

        <FieldGroup>
          <Field data-invalid={!!fields.name.errors}>
            <FieldLabel htmlFor={fields.name.id}>Name</FieldLabel>
            <Input
              {...getInputProps(fields.name, { type: "text" })}
              aria-invalid={!!fields.name.errors}
              autoComplete="name"
              placeholder="Your name"
              enterKeyHint="next"
            />
            {fields.name.errors ? <FieldError>{fields.name.errors}</FieldError> : null}
          </Field>
          <Field data-invalid={!!fields.email.errors}>
            <FieldLabel htmlFor={fields.email.id}>Email</FieldLabel>
            <Input
              {...getInputProps(fields.email, { type: "email" })}
              aria-invalid={!!fields.email.errors}
              autoComplete="email"
              placeholder="you@example.com"
              enterKeyHint="next"
            />
            {fields.email.errors ? <FieldError>{fields.email.errors}</FieldError> : null}
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field data-invalid={!!fields.password.errors}>
            <FieldLabel htmlFor={fields.password.id}>Password</FieldLabel>
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
            <FieldLabel htmlFor={fields.confirmPassword.id}>Confirm password</FieldLabel>
            <Input
              {...getInputProps(fields.confirmPassword, { type: "password" })}
              aria-invalid={!!fields.confirmPassword.errors}
              autoComplete="new-password"
              placeholder="Repeat your password"
              enterKeyHint="done"
            />
            {fields.confirmPassword.errors && (
              <FieldError>{fields.confirmPassword.errors}</FieldError>
            )}
          </Field>
        </FieldGroup>

        <Field orientation="horizontal" className="grid grid-cols-2 gap-2">
          <Button
            disabled={isPending}
            nativeButton={false}
            variant="outline"
            render={<Link to="/auth/login" />}
          >
            Log in instead
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : "Sign up"}
          </Button>
        </Field>
      </FieldSet>
    </Form>
  );
}
