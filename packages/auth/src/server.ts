import { database } from "@blehprint/database";
import * as schema from "@blehprint/database/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { redirect } from "react-router";

export type AuthInstance = ReturnType<typeof createAuth>;
export type SessionData = Awaited<
  ReturnType<AuthInstance["api"]["getSession"]>
>;

/**
 * Create a BetterAuth instance configured for Cloudflare D1
 */
export function createAuth(d1: D1Database, secret: string) {
  const db = database(d1);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        ...schema,
      },
    }),
    secret,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async function ({ user, url, token }, request) {
        console.log("=== Password Reset ===");
        console.log("User:", user.email);
        console.log("Reset URL:", url);
        console.log("Token:", token);
        console.log("====================");
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url, token }, request) => {
        console.log("=== Email Verification ===");
        console.log("User:", user.email);
        console.log("Verification URL:", url);
        console.log("Token:", token);
        console.log("====================");
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      // cookieCache: {
      //   enabled: true,
      //   maxAge: 60 * 5, // 5 minutes
      // },
    },
    plugins: [],
  });
}

/**
 * Get the current session from a request
 * Returns null if not authenticated
 */
export async function getSession(
  request: Request,
  d1: D1Database,
  secret: string,
): Promise<SessionData> {
  const auth = createAuth(d1, secret);
  return auth.api.getSession({ headers: request.headers });
}

/**
 * Require authentication for a route
 * Throws a redirect to /login if not authenticated
 */
export async function requireAuth(
  request: Request,
  d1: D1Database,
  secret: string,
  redirectTo = "/login",
): Promise<NonNullable<SessionData>> {
  const session = await getSession(request, d1, secret);

  if (!session) {
    const url = new URL(request.url);
    const callbackUrl = encodeURIComponent(url.pathname + url.search);
    throw redirect(`${redirectTo}?callbackUrl=${callbackUrl}`);
  }

  return session;
}
