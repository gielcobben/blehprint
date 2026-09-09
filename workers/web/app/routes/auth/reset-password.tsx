import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "react-router";
import { ResetPasswordPage, resetPasswordSchema } from "~/pages/auth/reset-password";
import { errorMessage, getSession, post } from "~/utils/auth.server";
import type { Route } from "./+types/reset-password";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Reset password" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  if (await getSession(request)) {
    throw redirect("/");
  }

  return null;
}

export async function action({ request, params }: Route.ActionArgs) {
  const submission = parseWithZod(await request.formData(), { schema: resetPasswordSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const response = await post(request, "/v1/auth/reset-password", {
    token: params.token,
    newPassword: submission.value.password,
  });

  if (!response.ok) {
    const message = await errorMessage(response, "This reset link is invalid or has expired.");

    return submission.reply({ formErrors: [message] });
  }

  return redirect("/auth/login");
}

export default function ResetPasswordRoute(_: Route.ComponentProps) {
  return <ResetPasswordPage />;
}
