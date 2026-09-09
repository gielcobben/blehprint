import { env } from "cloudflare:workers";
import type { Session } from "@blehprint/auth";
import { redirect } from "react-router";

export type { Session };

/**
 * Call the API worker over its service binding, forwarding the browser's
 * cookies and origin so BetterAuth can read the session and check the origin.
 * The hostname is ignored by the binding; it only has to be a full URL.
 */
export function api(request: Request, path: string, init: RequestInit = {}) {
  const origin = new URL(request.url).origin;
  const headers = new Headers(init.headers);
  headers.set("Cookie", request.headers.get("Cookie") ?? "");
  headers.set("Origin", origin);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return env.API.fetch(`${origin}${path}`, { ...init, headers });
}

/** POST JSON to the API. */
export function post(request: Request, path: string, body: unknown) {
  return api(request, path, { method: "POST", body: JSON.stringify(body) });
}

/** Current session, or null when the user is signed out. */
export async function getSession(request: Request): Promise<Session | null> {
  const response = await api(request, "/v1/auth/get-session");

  if (!response.ok) {
    return null;
  }

  return response.json<Session | null>();
}

/** Like getSession, but redirects to the login page when signed out. */
export async function requireSession(request: Request): Promise<Session> {
  const session = await getSession(request);

  if (!session) {
    const { pathname, search } = new URL(request.url);

    throw redirect(`/auth/login?redirectTo=${encodeURIComponent(pathname + search)}`);
  }

  return session;
}

/**
 * Copy every Set-Cookie header from an API response onto a redirect, so the
 * session cookie BetterAuth issued reaches the browser.
 */
export function redirectWithCookies(to: string, from: Response) {
  const headers = new Headers();

  for (const cookie of from.headers.getSetCookie()) {
    headers.append("Set-Cookie", cookie);
  }

  return redirect(to, { headers });
}

/** Human-readable message from a failed API response. */
export async function errorMessage(
  response: Response,
  fallback = "Something went wrong. Please try again.",
) {
  const body = await response
    .json<{ code?: string; message?: string }>()
    .catch(() => ({}) as { code?: string; message?: string });

  if (body.code === "EMAIL_NOT_VERIFIED") {
    return "Please verify your email address before signing in.";
  }

  return body.message ?? fallback;
}
