import { createAuth } from "@blehprint/auth";
import { env } from "cloudflare:workers";
import type { Route } from "./+types/auth";

export async function loader({ request }: Route.LoaderArgs) {
  const auth = createAuth(env.DB, env.BETTER_AUTH_SECRET);
  return auth.handler(request);
}

export async function action({ request }: Route.ActionArgs) {
  const auth = createAuth(env.DB, env.BETTER_AUTH_SECRET);
  return auth.handler(request);
}
