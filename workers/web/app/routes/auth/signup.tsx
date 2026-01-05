import { redirect } from "react-router";
import type { Route } from "./+types/signup";
import { getSession } from "~/utils/auth.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Sign Up" }];
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
      <h1>Sign Up</h1>
    </>
  );
}
