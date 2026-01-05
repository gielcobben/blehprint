import { redirect } from "react-router";
import type { Route } from "./+types/login";
import { getSession } from "~/utils/auth.server";

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

export default function LoginPage({}: Route.ComponentProps) {
  return (
    <>
      <h1>Login</h1>
    </>
  );
}
