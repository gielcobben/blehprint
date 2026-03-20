import { env } from "cloudflare:workers";
import { VerifyEmailPage } from "~/pages/auth/verify-email";
import type { Route } from "./+types/verify-email";
import { redirect } from "react-router";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Verify your email" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    throw redirect("/auth/signup");
  }

  const response = await fetch(
    `${env.API_URL}/v1/auth/verify-email?token=${token}`,
    { headers: { cookie: request.headers.get("cookie") ?? "" } }
  );

  if (response.ok) {
    return redirect("/auth/login");
  }

  return redirect("/auth/signup");
}

export default function VerifyEmailRoute({}: Route.ComponentProps) {
  return <VerifyEmailPage />;
}
