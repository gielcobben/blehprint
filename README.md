# Blehprint — Separate API

A full-stack TypeScript monorepo template for Cloudflare Workers, with the API running as its own Worker.

**Auth, database, UI components, dark mode, tests** — wired up and ready to deploy.

> Prefer a single worker? Use the [single-worker branch](https://github.com/gielcobben/blehprint/tree/single-worker).

## How it fits together

| Worker         | Role                                                                          |
| -------------- | ----------------------------------------------------------------------------- |
| `workers/web`  | React Router 8 app with SSR. Renders pages, handles forms, holds no secrets.  |
| `workers/api`  | Hono API. Owns the D1 database and mounts BetterAuth at `/v1/auth/*`.         |

The web worker calls the API through a [service binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/): no public URL, no CORS, no extra hop. Locally, one `bun run dev` starts both workers.

## Get started

Prerequisites: [Bun](https://bun.sh) and a [Cloudflare account](https://dash.cloudflare.com/sign-up).

```bash
bunx degit gielcobben/blehprint my-app
cd my-app
bun run rename my-app   # @blehprint/* → @my-app/*, then removes itself
bun install
bun run setup           # .dev.vars with a fresh secret, generated types, local migrations
bun run dev             # http://localhost:3000
```

Sign up, then look at the terminal: until you plug in an email provider, verification and reset links are printed there as `[auth] …`.

## Scripts

| Command                     | What it does                                                   |
| --------------------------- | -------------------------------------------------------------- |
| `bun run dev`               | Web and API together, with hot reload                          |
| `bun run typecheck`         | Regenerates worker types, then `tsc` in every workspace        |
| `bun run test`              | API tests in workerd against a real D1, web unit tests         |
| `bun run check` / `format`  | Biome lint and format                                          |
| `bun run build`             | Production build of both workers                               |
| `bun run deploy`            | Deploy the API, then the web worker                            |
| `bun run db:generate`       | Create a migration from schema changes                         |
| `bun run db:migrate:local`  | Apply migrations to the local D1                               |
| `bun run db:migrate:remote` | Apply migrations to production                                 |
| `bun run db:studio`         | Drizzle Studio on the local database                           |
| `bun run ui:add <name>`     | Add a shadcn/ui component to `packages/ui`                     |

## Tech stack

- [Bun](https://bun.sh) workspaces
- [React Router 8](https://reactrouter.com) framework mode on [Cloudflare Workers](https://workers.cloudflare.com), built with the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/)
- [Hono](https://hono.dev) for the API
- [Cloudflare D1](https://developers.cloudflare.com/d1/) with [Drizzle ORM](https://orm.drizzle.team)
- [BetterAuth](https://better-auth.com) email and password auth with verification and reset
- [Tailwind CSS v4](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com)
- [Conform](https://conform.guide) and [Zod](https://zod.dev) for forms
- [Vitest](https://vitest.dev) with the [Cloudflare Vitest plugin](https://developers.cloudflare.com/workers/testing/vitest-integration/)
- [Biome](https://biomejs.dev) for lint and format

## Packages

| Package                                      | Docs                                    |
| -------------------------------------------- | --------------------------------------- |
| [`workers/web`](./workers/web)               | [README](./workers/web/README.md)       |
| [`workers/api`](./workers/api)               | [README](./workers/api/README.md)       |
| [`@blehprint/auth`](./packages/auth)         | [README](./packages/auth/README.md)     |
| [`@blehprint/database`](./packages/database) | [README](./packages/database/README.md) |
| [`@blehprint/ui`](./packages/ui)             | [README](./packages/ui/README.md)       |

## Quick reference

**Session in a loader**

```ts
import { getSession, requireSession } from "~/utils/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);      // Session | null
  const { user } = await requireSession(request); // redirects to /auth/login when signed out
}
```

**Calling the API**

```ts
import { api, post } from "~/utils/auth.server";

const res = await post(request, "/v1/auth/sign-in/email", { email, password });
const health = await api(request, "/v1/health");
```

**Database in the API worker**

```ts
import { database, user } from "@blehprint/database";

const db = database(c.env.DB);
const users = await db.select().from(user);
```

**Theme**: `useTheme()` from `remix-themes` anywhere in the web app; the preference is stored in a cookie via `/api/theme`.

## Deploy

1. Create the database and put its id in `workers/api/wrangler.jsonc`:

   ```bash
   bunx wrangler d1 create my-app-database
   ```

2. Set the production web URL in `workers/api/wrangler.jsonc` (`vars.WEB_URL`). It is used for email links and as the trusted origin.

3. Apply migrations and set the secret:

   ```bash
   bun run db:migrate:remote
   cd workers/api && bunx wrangler secret put BETTER_AUTH_SECRET
   ```

4. Deploy:

   ```bash
   bun run deploy
   ```

The API worker is deployed first so the web worker's service binding has a target.

## Sending real emails

Pass `sendEmail` to `createAuth` in `workers/api/src/auth.ts`. It receives `{ to, subject, url }`; the default logs the link to the console.

## Working with AI agents

[`AGENTS.md`](./AGENTS.md) describes the layout, commands and conventions for coding agents. `CLAUDE.md` imports it, so Claude Code and Cursor read the same file.

## License

[MIT](./LICENSE) — [Giel Cobben](https://github.com/gielcobben)
