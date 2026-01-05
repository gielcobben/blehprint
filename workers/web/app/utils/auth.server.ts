import {
  createAuth as createAuthInstance,
  getSession as getSessionAuth,
} from "@blehprint/auth";
import { env } from "cloudflare:workers";

/**
 * Create a BetterAuth instance for the server
 * @returns The BetterAuth instance for the server
 */
export function serverAuth() {
  return createAuthInstance(env.DB, env.BETTER_AUTH_SECRET);
}

/**
 * Get the current session from a request
 * @param request - The request to get the session from
 * @returns The current session or null if not authenticated
 */
export function getSession(request: Request) {
  return getSessionAuth(request, env.DB, env.BETTER_AUTH_SECRET);
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
    const data = (await error.json().catch(() => ({}))) as { message?: string };
    return data.message || fallback;
  }

  return getAuthErrorMessage(error, fallback);
}
