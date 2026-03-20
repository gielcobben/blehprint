import { env } from "cloudflare:workers";
import type { Route } from "./+types/auth";

async function proxy(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const apiPath = url.pathname.replace("/api/auth", "/v1/auth");
  return fetch(`${env.API_URL}${apiPath}${url.search}`, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    duplex: "half",
  } as RequestInit);
}

export async function loader({ request }: Route.LoaderArgs) {
  return proxy(request);
}

export async function action({ request }: Route.ActionArgs) {
  return proxy(request);
}
