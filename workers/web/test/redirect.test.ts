import { describe, expect, it } from "vitest";
import { safeRedirect } from "~/utils/redirect";

describe("safeRedirect", () => {
  it("keeps same-site paths", () => {
    expect(safeRedirect("/dashboard?tab=2")).toBe("/dashboard?tab=2");
  });

  it("falls back for missing, external or protocol-relative targets", () => {
    expect(safeRedirect(null)).toBe("/");
    expect(safeRedirect("")).toBe("/");
    expect(safeRedirect("https://evil.example")).toBe("/");
    expect(safeRedirect("//evil.example")).toBe("/");
    expect(safeRedirect("/\\evil.example")).toBe("/");
    expect(safeRedirect("nope", "/home")).toBe("/home");
  });
});
