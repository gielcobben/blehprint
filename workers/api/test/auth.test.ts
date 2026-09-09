import { describe, expect, it } from "vitest";
import { call, cookieFrom, countUsers, markVerified, signUp } from "./helpers";

const PASSWORD = "correct horse battery";

describe("sign up", () => {
  it("creates the user and reports the email as unverified", async () => {
    const { email, response } = await signUp();
    expect(response.status).toBe(200);
    const body = await response.json<{ user: { email: string; emailVerified: boolean } }>();
    expect(body.user.email).toBe(email);
    expect(body.user.emailVerified).toBe(false);
  });

  it("does not reveal an existing account and does not create a second one", async () => {
    const { email } = await signUp();
    const { response } = await signUp(email);
    // BetterAuth answers like a fresh sign-up so the form cannot be used to
    // probe which emails are registered.
    expect(response.status).toBe(200);
    expect(await countUsers(email)).toBe(1);
  });
});

describe("sign in", () => {
  it("refuses an unverified email with EMAIL_NOT_VERIFIED", async () => {
    const { email } = await signUp();
    const response = await call("/v1/auth/sign-in/email", { body: { email, password: PASSWORD } });
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ code: "EMAIL_NOT_VERIFIED" });
  });

  it("refuses a wrong password", async () => {
    const { email } = await signUp();
    await markVerified(email);
    const response = await call("/v1/auth/sign-in/email", { body: { email, password: "nope" } });
    expect(response.status).toBe(401);
  });

  it("issues a session cookie that get-session accepts, and sign-out clears it", async () => {
    const { email } = await signUp();
    await markVerified(email);

    const signIn = await call("/v1/auth/sign-in/email", { body: { email, password: PASSWORD } });
    expect(signIn.status).toBe(200);
    const cookie = cookieFrom(signIn);
    expect(cookie).toContain("better-auth.session_token=");

    const session = await call("/v1/auth/get-session", { cookie });
    expect(session.status).toBe(200);
    expect(await session.json()).toMatchObject({ user: { email } });

    const signOut = await call("/v1/auth/sign-out", { body: {}, cookie });
    expect(signOut.status).toBe(200);

    const after = await call("/v1/auth/get-session", { cookie: cookieFrom(signOut) });
    expect(await after.json()).toBeNull();
  });

  it("returns null for get-session without a cookie", async () => {
    const response = await call("/v1/auth/get-session");
    expect(response.status).toBe(200);
    expect(await response.json()).toBeNull();
  });

  it("rejects requests from an origin that is not the web app", async () => {
    const response = await call("/v1/auth/sign-in/email", {
      body: { email: "a@example.com", password: PASSWORD },
      origin: "https://evil.example",
    });

    expect(response.status).toBe(403);
  });
});
