import { parseWithZod } from "@conform-to/zod/v4";
import { env } from "cloudflare:workers";
import { redirect } from "react-router";
import { LoginPage, loginSchema } from "~/pages/auth/login";
import { getAuthErrorMessageAsync, getSession } from "~/utils/auth.server";
import type { Route } from "./+types/login";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Login" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);

  if (session) {
    return redirect("/");
  }

  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: loginSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    const response = await fetch(`${env.API_URL}/v1/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") ?? "",
      },
      body: JSON.stringify(submission.value),
    });

    if (response.ok) {
      return redirect("/", {
        headers: {
          "Set-Cookie": response.headers.get("Set-Cookie") || "",
        },
      });
    }

    // Handle non-ok responses (including 403 email verification errors)
    const message = await getAuthErrorMessageAsync(
      response,
      "Invalid email or password"
    );
    return submission.reply({ formErrors: [message] });
  } catch (error) {
    const message = await getAuthErrorMessageAsync(
      error,
      "Invalid email or password"
    );
    return submission.reply({ formErrors: [message] });
  }
}

export default function LoginRoute({}: Route.ComponentProps) {
  return <LoginPage />;
}
