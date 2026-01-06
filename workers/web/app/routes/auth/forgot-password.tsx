import { redirect } from "react-router";
import type { Route } from "./+types/forgot-password";
import {
  getAuthErrorMessageAsync,
  getSession,
  serverAuth,
} from "~/utils/auth.server";
import { parseWithZod } from "@conform-to/zod/v4";
import {
  forgotPasswordSchema,
  ForgotPasswordPage,
} from "~/pages/auth/forgot-password";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Forgot Password" }];
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
  const submission = parseWithZod(formData, {
    schema: forgotPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    const auth = serverAuth();
    const response = await auth.api.requestPasswordReset({
      body: {
        ...submission.value,
      },
      asResponse: true,
    });

    if (response.ok) {
      return redirect("/auth/check-email", {
        headers: {
          "Set-Cookie": response.headers.get("Set-Cookie") || "",
        },
      });
    }

    return submission.reply({
      formErrors: ["Unable to send reset email. Please try again."],
    });
  } catch (error) {
    const message = await getAuthErrorMessageAsync(
      error,
      "Unable to send reset email. Please try again."
    );
    return submission.reply({ formErrors: [message] });
  }
}

export default function ForgotPasswordRoute({}: Route.ComponentProps) {
  return <ForgotPasswordPage />;
}
