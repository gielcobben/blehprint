import { redirect } from "react-router";
import { post, redirectWithCookies } from "~/utils/auth.server";
import type { Route } from "./+types/logout";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Log out" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const response = await post(request, "/v1/auth/sign-out", {});
  // Sign-out clears the cookie; if it failed there was no session to clear.
  return response.ok ? redirectWithCookies("/auth/login", response) : redirect("/auth/login");
}
