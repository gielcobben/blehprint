import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "react-router";
import { SignupPage, signupSchema } from "~/pages/auth/signup";
import { errorMessage, getSession, post } from "~/utils/auth.server";
import type { Route } from "./+types/signup";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Sign up" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  if (await getSession(request)) throw redirect("/");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const submission = parseWithZod(await request.formData(), { schema: signupSchema });
  if (submission.status !== "success") return submission.reply();

  const { name, email, password } = submission.value;
  const response = await post(request, "/v1/auth/sign-up/email", { name, email, password });
  if (!response.ok) {
    const message = await errorMessage(response, "Unable to sign up. Please try again.");
    return submission.reply({ formErrors: [message] });
  }
  // Email verification is required, so there is no session yet.
  return redirect("/auth/check-email?for=verify");
}

export default function SignupRoute(_: Route.ComponentProps) {
  return <SignupPage />;
}
