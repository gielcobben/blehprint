# @blehprint/auth

`createAuth()` configures [BetterAuth](https://better-auth.com) for Cloudflare D1 through the Drizzle adapter. The API worker calls it per request and hands the result's `handler` to Hono.

```ts
import { createAuth } from "@blehprint/auth";

const auth = createAuth({
  db: env.DB,
  secret: env.BETTER_AUTH_SECRET,
  webUrl: env.WEB_URL,          // email links + trusted origin
  basePath: "/v1/auth",         // default
  sendEmail: async ({ to, subject, url }) => { /* your provider */ },
});

return auth.handler(request);
```

## What is enabled

- Email and password, with **required email verification**
- Password reset
- Sessions of 7 days, refreshed after 1 day
- Trusted origin and base URL set to `webUrl`

Emails are built from the token BetterAuth provides, so the links point at the web app:

| Email        | Link                                         |
| ------------ | -------------------------------------------- |
| Verification | `${webUrl}/auth/verify-email?token=…`        |
| Reset        | `${webUrl}/auth/reset-password/…`            |

Without `sendEmail`, links are logged to the console as `[auth] …`.

## Types

```ts
import type { Session, User } from "@blehprint/auth";
```

`Session` is `{ user, session }` exactly as `GET /v1/auth/get-session` returns it.

## Changing the configuration

Edit `src/server.ts`. To add a social provider or plugin, follow the BetterAuth docs; the schema in `@blehprint/database` matches BetterAuth's core tables. After schema changes run `bun run db:generate`.
