# Blehprint

A modern full-stack TypeScript monorepo template for building applications on Cloudflare's edge platform.

## Tech Stack

- **Runtime:** [Bun](https://bun.sh) — Fast all-in-one JavaScript runtime and package manager
- **Framework:** [React Router v7](https://reactrouter.com) — Full-stack React framework with SSR
- **Hosting:** [Cloudflare Workers](https://workers.cloudflare.com) — Edge-first serverless compute
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) — Serverless SQLite at the edge
- **ORM:** [Drizzle ORM](https://orm.drizzle.team) — TypeScript-first SQL ORM
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) — Utility-first CSS framework
- **Build Tool:** [Vite](https://vitejs.dev) — Next-generation frontend tooling
- **Type Safety:** [TypeScript](https://www.typescriptlang.org) with [Total TypeScript](https://github.com/total-typescript/tsconfig) strict config

## Project Structure

```
blehprint/
├── packages/
│   └── database/          # Shared database package
│       ├── src/
│       │   ├── schema.ts  # Drizzle ORM schema definitions
│       │   ├── client.ts  # Database client factory
│       │   └── index.ts   # Package exports
│       └── migrations/    # D1 SQL migrations
│
├── workers/
│   └── web/               # Main web application
│       ├── app/
│       │   ├── routes/    # React Router route modules
│       │   ├── pages/     # Page components
│       │   ├── root.tsx   # Root layout component
│       │   └── entry.*.ts # Entry points
│       └── public/        # Static assets
│
└── .wrangler/state/       # Shared local D1 state (gitignored)
```

## Prerequisites

- [Bun](https://bun.sh) v1.0+
- [Cloudflare account](https://dash.cloudflare.com/sign-up) (for deployment)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (installed as dev dependency)

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Set up the database

Create a D1 database on Cloudflare:

```bash
bunx wrangler d1 create blehprint-database
```

Copy the `database_id` from the output and update it in:
- `packages/database/wrangler.jsonc`
- `workers/web/wrangler.jsonc`

### 3. Run migrations

```bash
# Local development
bun run db:migrate:local

# Production
bun run db:migrate:remote
```

### 4. Start development server

```bash
bun run dev:web
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

### Root Commands

| Command | Description |
|---------|-------------|
| `bun run dev:web` | Start web development server |
| `bun run build:web` | Build web worker for production |
| `bun run deploy:web` | Build and deploy web worker |
| `bun run deploy:all` | Deploy all workers and database |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate:local` | Apply migrations to local D1 |
| `bun run db:migrate:remote` | Apply migrations to remote D1 |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run typecheck` | Run TypeScript checks |
| `bun run cf:typegen` | Generate Cloudflare types |

## Database

The `@blehprint/database` package provides a shared database layer using Drizzle ORM with Cloudflare D1.

### Schema

Define your tables in `packages/database/src/schema.ts`:

```typescript
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
```

### Usage

Import the database client in your routes:

```typescript
import { database } from "@blehprint/database";
import { env } from "cloudflare:workers";

export async function loader() {
  const db = database(env.DB);
  const users = await db.query.users.findMany();
  return { users };
}
```

### Migrations

```bash
# Generate a new migration after schema changes
bun run db:generate

# Apply to local database
bun run db:migrate:local

# Apply to production
bun run db:migrate:remote
```

## Deployment

### Deploy the web worker

```bash
bun run deploy:web
```

### Deploy everything

```bash
bun run deploy:all
```

## Local Development

The monorepo shares local D1 state across packages via `.wrangler/state/`. This ensures the database package and web worker operate on the same local database during development.

### Drizzle Studio

Inspect your local database with Drizzle Studio:

```bash
bun run db:studio
```

## Adding New Packages

1. Create a new directory under `packages/` or `workers/`
2. Add a `package.json` with the appropriate name (`@blehprint/your-package`)
3. The workspace will automatically pick it up

## License

MIT
