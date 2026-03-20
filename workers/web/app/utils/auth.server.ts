import { env } from "cloudflare:workers";
import { redirect } from "react-router";

function apiUrl(path: string) {
  return `${env.API_URL}${path}`;
}

function authHeaders(request: Request): HeadersInit {
  return {
    Cookie: request.headers.get("Cookie") || "",
    "Content-Type": "application/json",
    Origin: new URL(request.url).origin,
  };
}

export async function getSession(request: Request) {
  const res = await fetch(apiUrl("/v1/auth/get-session"), {
    headers: {
      Cookie: request.headers.get("Cookie") || "",
      Origin: new URL(request.url).origin,
    },
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ session: unknown; user: unknown } | null>;
}

export async function requireSession(request: Request) {
  const session = await getSession(request);
  if (!session) throw redirect("/auth/login");
  return session;
}

export async function signUpEmail(
  request: Request,
  body: { name: string; email: string; password: string },
): Promise<Response> {
  return fetch(apiUrl("/v1/auth/sign-up/email"), {
    method: "POST",
    headers: authHeaders(request),
    body: JSON.stringify(body),
  });
}

export async function signInEmail(
  request: Request,
  body: { email: string; password: string },
): Promise<Response> {
  return fetch(apiUrl("/v1/auth/sign-in/email"), {
    method: "POST",
    headers: authHeaders(request),
    body: JSON.stringify(body),
  });
}

export async function signOut(request: Request): Promise<Response> {
  return fetch(apiUrl("/v1/auth/sign-out"), {
    method: "POST",
    headers: authHeaders(request),
    body: JSON.stringify({}),
  });
}

export async function requestPasswordReset(
  request: Request,
  body: { email: string },
): Promise<Response> {
  return fetch(apiUrl("/v1/auth/forget-password"), {
    method: "POST",
    headers: authHeaders(request),
    body: JSON.stringify({ ...body, redirectTo: "/auth/reset-password" }),
  });
}

export async function resetPassword(
  request: Request,
  body: { token: string; newPassword: string },
): Promise<Response> {
  return fetch(apiUrl("/v1/auth/reset-password"), {
    method: "POST",
    headers: authHeaders(request),
    body: JSON.stringify(body),
  });
}

export async function verifyEmail(token: string): Promise<Response> {
  return fetch(
    apiUrl(`/v1/auth/verify-email?token=${encodeURIComponent(token)}`),
  );
}

export async function getErrorMessage(
  response: Response,
  fallback = "Something went wrong. Please try again.",
): Promise<string> {
  if (response.status === 403) {
    return "Please verify your email address before signing in.";
  }
  try {
    const data = (await response.json()) as { message?: string };
    return data.message || fallback;
  } catch {
    return fallback;
  }
}

export function proxyAuthRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const apiPath = url.pathname.replace(/^\/api\/auth/, "/v1/auth");

  return fetch(`${env.API_URL}${apiPath}${url.search}`, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    // @ts-expect-error Cloudflare Workers supports duplex
    duplex: "half",
  });
}
