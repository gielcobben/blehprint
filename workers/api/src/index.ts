import { Hono } from "hono";
import { auth } from "./auth";

export type Env = { Bindings: Cloudflare.Env };

const app = new Hono<Env>().get("/v1/health", (c) => c.json({ ok: true })).route("/v1/auth", auth);

/** Route types for `hc<AppType>()` from `hono/client`. */
export type AppType = typeof app;

export default app;
