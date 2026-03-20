import { Hono } from "hono";
import { cors } from "hono/cors";
import { authApp } from "./auth";

export type Env = {
  Bindings: {
    DB: D1Database;
    BETTER_AUTH_SECRET: string;
    TRUSTED_ORIGINS: string;
    WEB_URL: string;
  };
};

const app = new Hono<Env>();

app.use(
  "/v1/*",
  cors({
    origin: (origin) => origin,
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.route("/v1/auth", authApp);
app.get("/v1/health", (c) => c.json({ ok: true }));

export type AppType = typeof app;
export default app;
