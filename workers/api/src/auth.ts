import { Hono } from "hono";
import { createAuth } from "@blehprint/auth";
import type { Env } from "./index";

export const authApp = new Hono<Env>();

authApp.all("/*", async (c) => {
  const origins = c.env.TRUSTED_ORIGINS?.split(",").filter(Boolean) ?? [];
  const auth = createAuth(c.env.DB, c.env.BETTER_AUTH_SECRET, {
    trustedOrigins: origins,
    webUrl: c.env.WEB_URL,
  });
  return auth.handler(c.req.raw);
});
