import { describe, expect, it } from "vitest";
import { loginSchema } from "~/pages/auth/login";
import { resetPasswordSchema } from "~/pages/auth/reset-password";
import { signupSchema } from "~/pages/auth/signup";

describe("auth form schemas", () => {
  it("login requires a valid email and an 8+ character password", () => {
    expect(loginSchema.safeParse({ email: "a@b.co", password: "12345678" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "nope", password: "12345678" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.co", password: "short" }).success).toBe(false);
  });

  it("signup rejects mismatched passwords on the confirm field", () => {
    const result = signupSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password: "12345678",
      confirmPassword: "87654321",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["confirmPassword"]);
  });

  it("reset rejects mismatched passwords on the confirm field", () => {
    const result = resetPasswordSchema.safeParse({ password: "12345678", confirmPassword: "x" });
    expect(result.success).toBe(false);
    expect(result.error?.issues.at(-1)?.path).toEqual(["confirmPassword"]);
  });
});
