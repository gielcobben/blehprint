import { env } from "cloudflare:workers";
import { redirect } from "react-router";
import { getSession } from "~/utils/auth.server";
import type { Route } from "./+types/logout";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Logout" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);

  if (!session) {
    return redirect("/auth/login");
  }

  const response = await fetch(`${env.API_URL}/v1/auth/sign-out`, {
    method: "POST",
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });

  if (response.ok) {
    return redirect("/auth/login", {
      headers: {
        "Set-Cookie": response.headers.get("Set-Cookie") || "",
      },
    });
  }

  return redirect("/auth/login");
}
