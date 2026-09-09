import { redirect } from "react-router";
import { VerifyEmailPage } from "~/pages/auth/verify-email";
import { api } from "~/utils/auth.server";
import type { Route } from "./+types/verify-email";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Verify your email" }];
}

export async function loader({ request, url }: Route.LoaderArgs) {
  const token = url.searchParams.get("token");
  if (!token) throw redirect("/auth/signup");

  const response = await api(request, `/v1/auth/verify-email?token=${encodeURIComponent(token)}`);
  if (response.ok) throw redirect("/auth/login?verified=1");
  // Invalid or expired link: render the page so the user can start over.
  return null;
}

export default function VerifyEmailRoute(_: Route.ComponentProps) {
  return <VerifyEmailPage />;
}
