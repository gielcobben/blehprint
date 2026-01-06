import { VerifyEmailPage } from "~/pages/auth/verify-email";
import type { Route } from "./+types/verify-email";
import { redirect } from "react-router";
import { serverAuth } from "~/utils/auth.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Verify your email" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    throw redirect("/auth/signup");
  }

  const auth = serverAuth();
  const response = await auth.api.verifyEmail({
    asResponse: true,
    query: { token },
  });

  if (response.ok) {
    return redirect("/auth/login");
  }

  return redirect("/auth/signup");
}

export default function VerifyEmailRoute({}: Route.ComponentProps) {
  return <VerifyEmailPage />;
}
