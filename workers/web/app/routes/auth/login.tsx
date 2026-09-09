import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "react-router";
import { LoginPage, loginSchema } from "~/pages/auth/login";
import { errorMessage, getSession, post, redirectWithCookies } from "~/utils/auth.server";
import type { Route } from "./+types/login";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Log in" }];
}

/** Only allow same-site paths as a post-login destination. */
function safeRedirect(to: string | null) {
  return to?.startsWith("/") && !to.startsWith("//") ? to : "/";
}

export async function loader({ request, url }: Route.LoaderArgs) {
  if (await getSession(request)) throw redirect("/");
  return { verified: url.searchParams.has("verified") };
}

export async function action({ request, url }: Route.ActionArgs) {
  const submission = parseWithZod(await request.formData(), { schema: loginSchema });
  if (submission.status !== "success") return submission.reply();

  const response = await post(request, "/v1/auth/sign-in/email", submission.value);
  if (!response.ok) {
    const message = await errorMessage(response, "Invalid email or password.");
    return submission.reply({ formErrors: [message] });
  }
  return redirectWithCookies(safeRedirect(url.searchParams.get("redirectTo")), response);
}

export default function LoginRoute({ loaderData }: Route.ComponentProps) {
  return <LoginPage verified={loaderData.verified} />;
}
