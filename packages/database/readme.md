# @blehprint/database

Database package using [Drizzle ORM](https://orm.drizzle.team) with [Cloudflare D1](https://developers.cloudflare.com/d1/).

## Features

- Type-safe database queries with Drizzle ORM
- Pre-configured BetterAuth schema tables
- Migration management with Drizzle Kit
- Local and remote migration support

## Installation

This package is included in the monorepo.

## Usage

### Creating a Database Client

```typescript
import { database } from "@blehprint/database";

const db = database(env.DB);
```

### Querying Data

```typescript
import { database } from "@blehprint/database";
import { user } from "@blehprint/database/schema";
import { eq } from "drizzle-orm";

const db = database(env.DB);

// Find all users
const users = await db.query.user.findMany();

// Find user by email
const user = await db.query.user.findFirst({
  where: eq(user.email, "user@example.com"),
});

// Insert a user
await db.insert(user).values({
  id: crypto.randomUUID(),
  name: "Jane Doe",
  email: "jane@example.com",
});
```

### Using in React Router Loaders

```typescript
import { database } from "@blehprint/database";
import { env } from "cloudflare:workers";

export async function loader() {
  const db = database(env.DB);
  const users = await db.query.user.findMany();
  return { users };
}
```

## Migrations

### Generate a migration

After modifying the schema:

```bash
bun run db:generate
```

### Apply migrations locally

```bash
bun run db:migrate:local
```

### Apply migrations to production

```bash
bun run db:migrate:remote
```

### Open Drizzle Studio

```bash
bun run db:studio
```

## Adding Custom Tables

Extend `src/schema.ts` with your own tables:

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { user } from "./schema";

export const post = sqliteTable("post", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Post = typeof post.$inferSelect;
export type NewPost = typeof post.$inferInsert;
```

Then generate and run migrations:

```bash
bun run db:generate
bun run db:migrate:local
```

## Exports

### From `@blehprint/database`

| Export     | Description                    |
| ---------- | ------------------------------ |
| `database` | Create a Drizzle client for D1 |
| `*`        | All schema tables and types    |

## Configuration

The D1 database is configured in `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "blehprint-database",
      "database_id": "your-database-id"
    }
  ]
}
```

## Related

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [@blehprint/auth](../auth/readme.md) — Authentication
