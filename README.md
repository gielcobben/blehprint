# Blehprint

A modern full-stack TypeScript monorepo template for building applications on Cloudflare's edge platform.

## Tech Stack

- **Runtime:** [Bun](https://bun.sh) — Fast all-in-one JavaScript runtime
- **Framework:** [React Router v7](https://reactrouter.com) — Full-stack React with SSR
- **Hosting:** [Cloudflare Workers](https://workers.cloudflare.com) — Edge-first serverless
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) + [Drizzle ORM](https://orm.drizzle.team)
- **Auth:** [BetterAuth](https://better-auth.com) — Modern TypeScript authentication
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)

## Packages

| Package                                      | Description                 | Docs                                    |
| -------------------------------------------- | --------------------------- | --------------------------------------- |
| [`@blehprint/auth`](./packages/auth)         | BetterAuth authentication   | [README](./packages/auth/readme.md)     |
| [`@blehprint/database`](./packages/database) | Drizzle ORM + D1 database   | [README](./packages/database/readme.md) |
| [`@blehprint/ui`](./packages/ui)             | shadcn/ui component library | [README](./packages/ui/readme.md)       |
| [`workers/web`](./workers/web)               | Main web application        | [README](./workers/web/README.md)       |

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Set up the database

Create a D1 database and update the config:

```bash
bunx wrangler d1 create blehprint-database
```

Copy the `database_id` to `packages/database/wrangler.jsonc` and `workers/web/wrangler.jsonc`.

### 3. Configure authentication

```bash
cp workers/web/.dev.vars.example workers/web/.dev.vars
openssl rand -base64 32  # Add output to .dev.vars as BETTER_AUTH_SECRET
```

### 4. Run migrations

```bash
bun run db:migrate:local
```

### 5. Start development

```bash
bun run dev:web
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                     | Description                    |
| --------------------------- | ------------------------------ |
| `bun run dev:web`           | Start development server       |
| `bun run build:web`         | Build for production           |
| `bun run deploy:web`        | Build and deploy to Workers    |
| `bun run deploy:all`        | Deploy everything              |
| `bun run db:generate`       | Generate Drizzle migrations    |
| `bun run db:migrate:local`  | Apply migrations locally       |
| `bun run db:migrate:remote` | Apply migrations to production |
| `bun run db:studio`         | Open Drizzle Studio            |
| `bun run typecheck`         | Run TypeScript checks          |

## Quick Reference

### Authentication

```typescript
import { getSession, requireAuth } from "@blehprint/auth";
import { env } from "cloudflare:workers";

// Check if authenticated
const session = await getSession(request, env.DB, env.BETTER_AUTH_SECRET);

// Require authentication (redirects to /login)
const session = await requireAuth(request, env.DB, env.BETTER_AUTH_SECRET);
```

→ [Full auth documentation](./packages/auth/readme.md)

### Database

```typescript
import { database } from "@blehprint/database";
import { env } from "cloudflare:workers";

const db = database(env.DB);
const users = await db.query.user.findMany();
```

→ [Full database documentation](./packages/database/readme.md)

### UI Components

```bash
cd packages/ui && bunx shadcn@latest add button
```

```tsx
import { Button } from "@blehprint/ui/components/button";
```

→ [Full UI documentation](./packages/ui/readme.md)

## Deployment

### Production secrets

```bash
bunx wrangler secret put BETTER_AUTH_SECRET
```

### Deploy

```bash
bun run deploy:web      # Deploy web worker
bun run deploy:all      # Deploy everything
```

## Project Structure

```
blehprint/
├── packages/
│   ├── auth/           # @blehprint/auth
│   ├── database/       # @blehprint/database
│   └── ui/             # @blehprint/ui
├── workers/
│   └── web/            # Main application
└── .wrangler/state/    # Local D1 state (gitignored)
```

## License

MIT
