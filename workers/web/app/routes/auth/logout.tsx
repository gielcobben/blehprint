import { redirect } from "react-router";
import { getSession, signOut } from "~/utils/auth.server";
import type { Route } from "./+types/logout";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Logout" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);

  if (!session) {
    return redirect("/auth/login");
  }

  const response = await signOut(request);

  if (response.ok) {
    return redirect("/auth/login", {
      headers: {
        "Set-Cookie": response.headers.get("Set-Cookie") || "",
      },
    });
  }

  return redirect("/auth/login");
}
