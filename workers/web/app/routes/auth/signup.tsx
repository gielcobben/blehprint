import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "react-router";
import type { Route } from "./+types/signup";
import { getErrorMessage, getSession, signUpEmail } from "~/utils/auth.server";
import { SignUpPage, signupSchema } from "~/pages/auth/signup";

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
    const response = await signUpEmail(request, {
      name: submission.value.name,
      email: submission.value.email,
      password: submission.value.password,
    });

    if (response.ok || response.status === 403) {
      return redirect("/auth/check-email", {
        headers: {
          "Set-Cookie": response.headers.get("Set-Cookie") || "",
        },
      });
    }

    const message = await getErrorMessage(response, "Unable to sign up. Please try again.");
    return submission.reply({ formErrors: [message] });
  } catch {
    return submission.reply({
      formErrors: ["Unable to sign up. Please try again."],
    });
  }
}

export default function LoginPage({}: Route.ComponentProps) {
  return <SignUpPage />;
}
