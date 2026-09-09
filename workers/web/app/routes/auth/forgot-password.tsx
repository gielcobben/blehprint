import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "react-router";
import { ForgotPasswordPage, forgotPasswordSchema } from "~/pages/auth/forgot-password";
import { errorMessage, getSession, post } from "~/utils/auth.server";
import type { Route } from "./+types/forgot-password";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Forgot password" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  if (await getSession(request)) throw redirect("/");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const submission = parseWithZod(await request.formData(), { schema: forgotPasswordSchema });
  if (submission.status !== "success") return submission.reply();

  const response = await post(request, "/v1/auth/request-password-reset", submission.value);
  if (!response.ok) {
    const message = await errorMessage(response, "Unable to send a reset link. Please try again.");
    return submission.reply({ formErrors: [message] });
  }
  return redirect("/auth/check-email?for=reset");
}

export default function ForgotPasswordRoute(_: Route.ComponentProps) {
  return <ForgotPasswordPage />;
}
