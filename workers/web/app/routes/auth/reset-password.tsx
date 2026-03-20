import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "react-router";
import {
  ResetPasswordPage,
  resetPasswordSchema,
} from "~/pages/auth/reset-password";
import { getErrorMessage, getSession, resetPassword } from "~/utils/auth.server";
import type { Route } from "./+types/reset-password";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Reset Password" }];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request);

  if (session) {
    throw redirect("/");
  }

  const token = params.token;

  if (!token) {
    throw redirect("/auth/forgot-password");
  }

  return { token };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: resetPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    const response = await resetPassword(request, submission.value);

    if (response.ok) {
      return redirect("/auth/login");
    }

    const message = await getErrorMessage(response, "Unable to reset password. Please try again.");
    return submission.reply({ formErrors: [message] });
  } catch {
    return submission.reply({
      formErrors: ["Unable to reset password. Please try again."],
    });
  }
}

export default function ResetPasswordRoute({
  loaderData,
}: Route.ComponentProps) {
  return <ResetPasswordPage token={loaderData.token} />;
}
