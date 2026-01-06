import { CheckEmailPage } from "~/pages/auth/check-email";
import type { Route } from "./+types/check-email";
import { getSession } from "~/utils/auth.server";
import { redirect } from "react-router";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Check your email" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);

  if (session) {
    throw redirect("/");
  }

  return null;
}

export default function CheckEmailRoute({}: Route.ComponentProps) {
  return <CheckEmailPage />;
}
