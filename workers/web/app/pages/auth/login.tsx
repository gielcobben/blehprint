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
  email: z.email("Enter a valid email address"),
  password: z.string("Password is required").min(8, "Password must be at least 8 characters"),
});

export function LoginPage({ verified = false }: { verified?: boolean }) {
  const lastResult = useActionData();
  const isPending = useIsPending();

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    constraint: getZodConstraint(loginSchema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema: loginSchema }),
  });

  return (
    <Form {...getFormProps(form)} method="POST" className="w-full max-w-xs px-4">
      <FieldSet>
        <FieldLegend>Log in</FieldLegend>
        <FieldDescription>
          {verified
            ? "Your email is verified. Log in to continue."
            : "Log in to your account to continue."}
        </FieldDescription>
        <FieldSeparator />

        {form.errors && <FieldError>{form.errors}</FieldError>}

        <FieldGroup>
          <Field data-invalid={!!fields.email.errors}>
            <FieldLabel htmlFor={fields.email.id}>Email</FieldLabel>
            <Input
              {...getInputProps(fields.email, { type: "email" })}
              aria-invalid={!!fields.email.errors}
              autoComplete="email"
              placeholder="you@example.com"
              enterKeyHint="next"
            />
            {fields.email.errors && <FieldError>{fields.email.errors}</FieldError>}
          </Field>

          <Field data-invalid={!!fields.password.errors} className="relative">
            <FieldLabel htmlFor={fields.password.id}>Password</FieldLabel>
            <Input
              {...getInputProps(fields.password, { type: "password" })}
              aria-invalid={!!fields.password.errors}
              autoComplete="current-password"
              placeholder="Your password"
              enterKeyHint="done"
            />
            {fields.password.errors && <FieldError>{fields.password.errors}</FieldError>}
            <Link
              to="/auth/forgot-password"
              className="absolute top-0 right-0 w-fit! text-muted-foreground text-xs"
            >
              Forgot password?
            </Link>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldGroup className="mt-4">
        <Field orientation="horizontal">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Spinner /> : "Log in"}
          </Button>
        </Field>
        <FieldDescription className="text-center">
          No account yet? <Link to="/auth/signup">Sign up</Link>
        </FieldDescription>
      </FieldGroup>
    </Form>
  );
}
