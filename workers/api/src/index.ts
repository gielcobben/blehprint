import { Hono } from "hono";
import { auth } from "./auth";

export type Env = { Bindings: Cloudflare.Env };

const app = new Hono<Env>()
  .get("/v1/health", async (c) => {
    const database = await c.env.DB.prepare("SELECT 1")
      .first()
      .then(() => "ok" as const)
      .catch(() => "unreachable" as const);
    const ok = database === "ok";
    return c.json({ ok, database }, ok ? 200 : 503);
  })
  .route("/v1/auth", auth);

/** Route types for `hc<AppType>()` from `hono/client`. */
export type AppType = typeof app;

export default app;
