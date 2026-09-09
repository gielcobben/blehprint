# Blehprint

Full-stack TypeScript monorepo on Cloudflare Workers. Two workers, three packages, one Bun workspace.

## Layout

| Path                | What it is                                                           |
| ------------------- | -------------------------------------------------------------------- |
| `workers/web`       | React Router 8 app (SSR). UI, routes, forms. Talks to the API only.  |
| `workers/api`       | Hono API. Owns the D1 database and mounts BetterAuth at `/v1/auth`.  |
| `packages/auth`     | `createAuth()` for BetterAuth on D1, plus `Session` and `User` types. |
| `packages/database` | Drizzle schema, D1 client, migrations.                               |
| `packages/ui`       | shadcn/ui components (Base UI + Tailwind v4). Add with `bun run ui:add <name>`. |

The web worker reaches the API through a **service binding** (`env.API`), never a URL.
Locally the Cloudflare Vite plugin runs both workers inside one `bun run dev`.

## Commands

```bash
bun run setup        # first run: .dev.vars, generated types, local migrations
bun run dev          # http://localhost:3000 (web + api)
bun run typecheck    # every workspace, regenerates worker types first
bun run test         # API tests in workerd (real D1), web unit tests
bun run check        # biome lint + format check   (bun run format to fix)
bun run db:generate  # after editing packages/database/src/schema.ts
bun run db:migrate:local
```

Run all four checks before calling work done: `typecheck`, `test`, `check`, and `bun run build`.

## Conventions

- **routes vs pages** in `workers/web/app`: `routes/*` hold `loader`, `action`, `meta` and a
  thin default export. `pages/*` are plain React components fed by props. No server imports in
  pages. Form schemas (zod) live next to the page that renders the form.
- **Server-only code** ends in `.server.ts`. Bindings come from `import { env } from "cloudflare:workers"`.
- **Calling the API** from the web: `api(request, "/v1/…")` or `post(request, "/v1/…", body)` in
  `app/utils/auth.server.ts`. They forward the browser's cookies and origin. Copy cookies back with
  `redirectWithCookies`.
- **Adding an API route**: add it to the Hono chain in `workers/api/src/index.ts` (or a new file
  mounted with `.route()`), then add a test in `workers/api/test/`.
- **Secrets** are declared in `workers/api/src/env.d.ts`, set in `.dev.vars` locally and with
  `wrangler secret put` in production. Non-secret config goes in `wrangler.jsonc` `vars`.
- **Database changes**: edit the schema, `bun run db:generate`, commit the new file in
  `packages/database/migrations`, `bun run db:migrate:local`.
- **Generated files** (`worker-configuration.d.ts`, `.react-router/`) are gitignored; `typecheck`
  regenerates them. Do not hand-edit them.
- Formatting is Biome (2 spaces, double quotes, 100 columns). Do not add another formatter.

## Things that look wrong but are not

- `packages/ui` components import `@blehprint/ui/...` by package name. That is shadcn's monorepo
  alias style so consumers can compile them; keep it.
- The API worker's `wrangler.jsonc` has a placeholder `database_id` and a placeholder `WEB_URL`.
  Both are replaced during deployment, see README.
- Emails are logged to the console (`[auth] …`) until `sendEmail` is passed to `createAuth`.
