import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "react-router";
import { LoginPage, loginSchema } from "~/pages/auth/login";
import {
  getAuthErrorMessageAsync,
  getSession,
  serverAuth,
} from "~/utils/auth.server";
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
    const auth = serverAuth();
    const response = await auth.api.signInEmail({
      body: {
        ...submission.value,
        // callbackURL: '/',
        // rememberMe: true,
      },
      asResponse: true,
    });

    if (response.ok) {
      return redirect("/", {
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
      "Invalid email or password"
    );
    return submission.reply({ formErrors: [message] });
  }
}

export default function LoginRoute({}: Route.ComponentProps) {
  return <LoginPage />;
}
