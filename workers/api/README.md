# API worker

[Hono](https://hono.dev) on Cloudflare Workers. Owns the D1 database and serves BetterAuth.

```
workers/api/
├── src/
│   ├── index.ts     # Hono app: /v1/health and the auth mount
│   ├── auth.ts      # createAuth() wired to bindings
│   └── env.d.ts     # secrets that are not in wrangler.jsonc
├── test/            # Vitest, runs in workerd with a migrated D1
├── wrangler.jsonc   # D1 binding, WEB_URL var, migrations_dir
└── vitest.config.ts
```

## Routes

| Route          | Handler                                                          |
| -------------- | ---------------------------------------------------------------- |
| `/v1/health`   | `{ ok: true }`                                                   |
| `/v1/auth/*`   | BetterAuth: sign-up, sign-in, get-session, sign-out, reset, verify |

Add a route by chaining on the app in `src/index.ts`, or create a file that exports a `Hono` instance and mount it with `.route("/v1/things", things)`. Keep the chain in one expression so `AppType` stays accurate for `hc<AppType>()` from `hono/client`.

## Configuration

| Name                 | Where                        | Purpose                                          |
| -------------------- | ---------------------------- | ------------------------------------------------ |
| `DB`                 | `wrangler.jsonc`             | D1 binding                                       |
| `WEB_URL`            | `wrangler.jsonc` → `vars`    | Email links and trusted origin. `.dev.vars` overrides it locally. |
| `BETTER_AUTH_SECRET` | `.dev.vars` / `wrangler secret put` | Signs sessions and tokens                 |

Secrets are typed in `src/env.d.ts` because `wrangler types` only sees what is in the config file.

## Who calls this worker

Only the web worker, through a service binding. Requests arrive with the web app's origin, which BetterAuth checks against `WEB_URL`. There is no CORS layer because browsers never talk to this worker directly. If you want to expose it publicly, add `hono/cors` with `origin: c.env.WEB_URL`.

## Scripts

| Command             | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `bun run dev`       | Standalone `wrangler dev` on port 8787          |
| `bun run test`      | Vitest in workerd; migrations applied per test file |
| `bun run typecheck` | `wrangler types` then `tsc`                     |
| `bun run deploy`    | `wrangler deploy`                               |

Normally you run `bun run dev` from the repo root instead, which starts this worker next to the web worker.
