import { getSession as getSessionAuth } from "@blehprint/auth";
import { env } from "cloudflare:workers";

export function getSession(request: Request) {
  return getSessionAuth(request, env.DB, env.BETTER_AUTH_SECRET);
}
