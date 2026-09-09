# @blehprint/database

[Drizzle ORM](https://orm.drizzle.team) schema and client for Cloudflare D1.

```ts
import { database, user } from "@blehprint/database";
import { eq } from "drizzle-orm";

const db = database(env.DB);
const rows = await db.select().from(user).where(eq(user.email, "ada@example.com"));
```

`schema` is also exported as a namespace for adapters that want the whole thing.

## Tables

`user`, `session`, `account`, `verification` — BetterAuth's core tables, with indexes on `session.user_id`, `account.user_id` and `verification.identifier`. Types are exported for each (`User`, `NewUser`, …).

## Adding a table

1. Add it to `src/schema.ts`:

   ```ts
   export const post = sqliteTable("post", {
     id: text("id").primaryKey(),
     title: text("title").notNull(),
     authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
     createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
   });
   ```

2. `bun run db:generate` writes a migration to `migrations/`.
3. `bun run db:migrate:local`, and commit the migration file.

## Migrations

Migrations are plain SQL files applied by Wrangler against the API worker's D1 binding, so the database id lives only in `workers/api/wrangler.jsonc`.

| Command                     | Target                           |
| --------------------------- | -------------------------------- |
| `bun run db:migrate:local`  | `.wrangler/state` (dev)          |
| `bun run db:migrate:remote` | Production                       |
| `bun run db:studio`         | Drizzle Studio on the local file |

Tests apply the same migrations to a fresh in-memory D1 per test file.
