import { redirect } from "react-router";
import type { Route } from "./+types/signup";
import {
  getAuthErrorMessageAsync,
  getSession,
  serverAuth,
} from "~/utils/auth.server";
import { SignUpPage, signupSchema } from "~/pages/auth/signup";
import { parseWithZod } from "@conform-to/zod/v4";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Sign Up" }];
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
    schema: signupSchema.refine(
      (data) => data.password === data.confirmPassword,
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }
    ),
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    const auth = serverAuth();
    const response = await auth.api.signUpEmail({
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
      formErrors: ["Unable to sign in. Please try again."],
    });
  } catch (error) {
    const message = await getAuthErrorMessageAsync(
      error,
      "Unable to sign up. Please try again."
    );
    return submission.reply({ formErrors: [message] });
  }
}

export default function LoginPage({}: Route.ComponentProps) {
  return <SignUpPage />;
}
