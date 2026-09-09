import { describe, expect, it } from "vitest";
import { call, lastToken, markVerified, signUp } from "./helpers";

describe("password reset", () => {
  it("resets the password with the emailed token", async () => {
    const { email } = await signUp();
    await markVerified(email);

    const request = await call("/v1/auth/request-password-reset", { body: { email } });
    expect(request.status).toBe(200);

    const token = await lastToken("reset-password");
    expect(token).toBeTruthy();

    const reset = await call("/v1/auth/reset-password", {
      body: { token, newPassword: "a brand new password" },
    });

    expect(reset.status).toBe(200);

    const oldPassword = await call("/v1/auth/sign-in/email", {
      body: { email, password: "correct horse battery" },
    });

    expect(oldPassword.status).toBe(401);

    const newPassword = await call("/v1/auth/sign-in/email", {
      body: { email, password: "a brand new password" },
    });

    expect(newPassword.status).toBe(200);
  });

  it("rejects a bogus token", async () => {
    const reset = await call("/v1/auth/reset-password", {
      body: { token: "not-a-real-token", newPassword: "a brand new password" },
    });

    expect(reset.ok).toBe(false);
  });
});
