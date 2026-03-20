import { Hono } from "hono";
import { createAuth } from "@blehprint/auth";
import type { Env } from "./index";

export const authApp = new Hono<{ Bindings: Env }>();

authApp.all("/*", async (c) => {
  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET);
  return auth.handler(c.req.raw);
});
