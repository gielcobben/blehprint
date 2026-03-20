import { Hono } from "hono";
import { cors } from "hono/cors";
import { authApp } from "./auth";

export type Env = {
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use(
  "/v1/*",
  cors({
    origin: ["http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.route("/v1/auth", authApp);
app.get("/v1/health", (c) => c.json({ ok: true }));

export type AppType = typeof app;
export default app;
