import { describe, expect, it } from "vitest";
import { call } from "./helpers";

describe("GET /v1/health", () => {
  it("reports ok", async () => {
    const response = await call("/v1/health");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it("returns 404 for unknown routes", async () => {
    const response = await call("/nope");
    expect(response.status).toBe(404);
  });
});
