import { createAuth } from "@blehprint/auth";
import { Hono } from "hono";
import type { Env } from "./index";

/**
 * Mounts the BetterAuth handler. Every request under /v1/auth/* is handled
 * by BetterAuth itself (sign-up, sign-in, get-session, reset-password, ...).
 */
export const auth = new Hono<Env>().all("/*", (c) =>
  createAuth({
    db: c.env.DB,
    secret: c.env.BETTER_AUTH_SECRET,
    webUrl: c.env.WEB_URL,
  }).handler(c.req.raw),
);
