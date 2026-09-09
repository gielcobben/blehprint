import { expect, it } from "vitest";
import { call } from "./helpers";

it("GET /v1/health reports the worker and database as ok", async () => {
  const response = await call("/v1/health");
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ ok: true, database: "ok" });
});
