import { env, exports } from "cloudflare:workers";

export const WEB_URL = "http://localhost:3000";

/** Call the worker the way the web worker does: same origin, JSON body, optional cookie. */
export function call(
  path: string,
  init: { method?: string; body?: unknown; cookie?: string; origin?: string } = {},
) {
  const headers = new Headers({ Origin: init.origin ?? WEB_URL });
  if (init.cookie) headers.set("Cookie", init.cookie);
  if (init.body !== undefined) headers.set("Content-Type", "application/json");
  return exports.default.fetch(`${WEB_URL}${path}`, {
    method: init.method ?? (init.body !== undefined ? "POST" : "GET"),
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
}

/** The session cookie from a sign-in response, ready to send back. */
export function cookieFrom(response: Response) {
  return response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(";")[0])
    .join("; ");
}

/** Reads the latest reset or verification token straight from the database. */
export async function lastToken(prefix: "reset-password" | "email-verification") {
  const row = await env.DB.prepare(
    "SELECT identifier FROM verification WHERE identifier LIKE ? ORDER BY created_at DESC LIMIT 1",
  )
    .bind(`${prefix}:%`)
    .first<{ identifier: string }>();
  return row?.identifier.slice(prefix.length + 1) ?? null;
}

export async function signUp(email = `user-${crypto.randomUUID()}@example.com`) {
  const response = await call("/v1/auth/sign-up/email", {
    body: { name: "Test User", email, password: "correct horse battery" },
  });
  return { email, response };
}

/** Marks the user verified directly so sign-in tests do not depend on email. */
export async function countUsers(email: string) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM user WHERE email = ?")
    .bind(email)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function markVerified(email: string) {
  await env.DB.prepare("UPDATE user SET email_verified = 1 WHERE email = ?").bind(email).run();
}
