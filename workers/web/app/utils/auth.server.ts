import { env } from "cloudflare:workers";

export async function getSession(request: Request) {
  const response = await fetch(`${env.API_URL}/v1/auth/get-session`, {
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });
  if (!response.ok) return null;
  return response.json() as Promise<{ session: unknown; user: unknown } | null>;
}

/**
 * Extracts an error message from various error types thrown by better-auth
 */
export function getAuthErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (error instanceof Response) {
    // This won't work synchronously - see async version below
    return fallback;
  }

  if (error && typeof error === "object") {
    if ("body" in error) {
      const body = (error as { body?: { message?: string } }).body;
      if (body?.message) return body.message;
    }
    if ("message" in error && typeof (error as Error).message === "string") {
      return (error as Error).message;
    }
  }

  return fallback;
}

/**
 * Async version that also handles Response errors
 */
export async function getAuthErrorMessageAsync(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): Promise<string> {
  if (error instanceof Response) {
    // Handle 403 email verification error
    if (error.status === 403) {
      return "Please verify your email address before signing in.";
    }

    const data = (await error.json().catch(() => ({}))) as { message?: string };
    return data.message || fallback;
  }

  return getAuthErrorMessage(error, fallback);
}
