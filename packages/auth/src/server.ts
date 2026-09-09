import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { database, schema } from "@blehprint/database";
import { betterAuth } from "better-auth";

export type AuthEmail = {
  to: string;
  subject: string;
  /** Link the user should open in the web app */
  url: string;
};

export type CreateAuthOptions = {
  /** D1 binding */
  db: D1Database;
  /** Secret used to sign sessions and tokens (BETTER_AUTH_SECRET) */
  secret: string;
  /** Public URL of the web app, used for email links and as the trusted origin */
  webUrl: string;
  /** Path the auth handler is mounted on in the API worker */
  basePath?: string;
  /** Where verification and reset emails go. Defaults to console.log. */
  sendEmail?: (email: AuthEmail) => Promise<void>;
};

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const SESSION_REFRESH_AGE = 60 * 60 * 24; // refresh a session if older than 1 day

async function logEmail(email: AuthEmail) {
  console.log(`[auth] ${email.subject} → ${email.to}\n       ${email.url}`);
}

/**
 * Create a BetterAuth instance backed by Cloudflare D1.
 */
export function createAuth(options: CreateAuthOptions) {
  const webUrl = options.webUrl.replace(/\/$/, "");
  const sendEmail = options.sendEmail ?? logEmail;

  return betterAuth({
    secret: options.secret,
    // The web worker calls the API through a service binding using its own
    // origin, so the auth server is addressed as WEB_URL + basePath.
    baseURL: webUrl,
    basePath: options.basePath ?? "/v1/auth",
    trustedOrigins: [webUrl],
    database: drizzleAdapter(database(options.db), {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: ({ user, token }) =>
        sendEmail({
          to: user.email,
          subject: "Reset your password",
          url: `${webUrl}/auth/reset-password/${token}`,
        }),
    },
    emailVerification: {
      sendVerificationEmail: ({ user, token }) =>
        sendEmail({
          to: user.email,
          subject: "Verify your email",
          url: `${webUrl}/auth/verify-email?token=${token}`,
        }),
    },
    session: {
      expiresIn: SESSION_MAX_AGE,
      updateAge: SESSION_REFRESH_AGE,
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;

/** `{ user, session }` as returned by `GET /v1/auth/get-session` */
export type Session = Auth["$Infer"]["Session"];
export type User = Session["user"];
