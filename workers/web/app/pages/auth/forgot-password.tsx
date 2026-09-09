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

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export function ForgotPasswordPage() {
  const lastResult = useActionData();
  const isPending = useIsPending();

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    constraint: getZodConstraint(forgotPasswordSchema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema: forgotPasswordSchema }),
  });

  return (
    <Form {...getFormProps(form)} method="POST" className="w-full max-w-xs px-4">
      <FieldSet>
        <FieldLegend>Forgot password</FieldLegend>
        <FieldDescription>We will email you a link to choose a new password.</FieldDescription>
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
              enterKeyHint="done"
            />
            {fields.email.errors && <FieldError>{fields.email.errors}</FieldError>}
          </Field>
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
              {isPending ? <Spinner /> : "Send reset link"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Form>
  );
}
