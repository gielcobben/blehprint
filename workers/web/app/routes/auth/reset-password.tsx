import { parseWithZod } from "@conform-to/zod/v4";
import { env } from "cloudflare:workers";
import { redirect } from "react-router";
import {
  ResetPasswordPage,
  resetPasswordSchema,
} from "~/pages/auth/reset-password";
import { getAuthErrorMessageAsync, getSession } from "~/utils/auth.server";
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
    const response = await fetch(`${env.API_URL}/v1/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") ?? "",
      },
      body: JSON.stringify(submission.value),
    });

    if (response.ok) {
      return redirect("/auth/login");
    }

    return submission.reply({
      formErrors: ["Unable to reset password. Please try again."],
    });
  } catch (error) {
    const message = await getAuthErrorMessageAsync(
      error,
      "Unable to reset password. Please try again."
    );
    return submission.reply({ formErrors: [message] });
  }
}

export default function ResetPasswordRoute({
  loaderData,
}: Route.ComponentProps) {
  return <ResetPasswordPage token={loaderData.token} />;
}
