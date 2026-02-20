# Blehprint

A modern full-stack TypeScript monorepo template for building applications on Cloudflare's edge platform.

## Use This Template

### 1. Clone and rename

```bash
bunx degit gielcobben/blehprint my-app
cd my-app
bun run rename my-app
```

This downloads the template (without git history) and renames all packages from `@blehprint/*` to `@my-app/*`.

### 2. Install dependencies

```bash
bun install
```

### 3. Set up the database

```bash
bunx wrangler d1 create my-app-database
```

Copy the `database_id` to `packages/database/wrangler.jsonc` and `workers/web/wrangler.jsonc`.

### 4. Configure authentication

```bash
cp workers/web/.dev.vars.example workers/web/.dev.vars
openssl rand -base64 32  # Add output to .dev.vars as BETTER_AUTH_SECRET
```

### 5. Run migrations

```bash
bun run db:migrate:local
```

### 6. Start development

```bash
bun run dev:web
```

Open [http://localhost:3000](http://localhost:3000).

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
| `bun run rename <name>`     | Rename the project (one-time)  |

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

### Icons

Icons are provided by [Lucide](https://lucide.dev). The package is available in both `@blehprint/ui` and `workers/web` so you can import icons directly where you need them without re-exporting through the UI package:

```tsx
import { ArrowRight, Loader2, Menu } from "lucide-react";

<ArrowRight className="size-4" />
```

Browse all available icons at [lucide.dev/icons](https://lucide.dev/icons). Only the icons you import are included in the bundle.

### Theming

Dark/light mode powered by [remix-themes](https://github.com/abereghici/remix-themes).

**Setup** — The theme is configured in `workers/web/app/root.tsx`:

- `ThemeProvider` wraps the app and syncs theme state
- `PreventFlashOnWrongTheme` prevents flash of wrong theme on SSR
- Theme class (`dark`/`light`) is applied to `<html>`
- Theme action endpoint at `/api/theme` handles persistence

**Usage** — Toggle theme anywhere with the `useTheme` hook:

```tsx
import { useTheme } from "remix-themes";

function ThemeToggle() {
  const [theme, setTheme] = useTheme();

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  );
}
```

**Configuration** — Cookie settings are in `workers/web/app/utils/theme.server.ts`. Update the domain for production.

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

## Author

[Giel Cobben](https://github.com/gielcobben)

## License

This project is open source and available under the [MIT License](./LICENSE).
