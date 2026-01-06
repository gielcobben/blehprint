# Web Worker

The main web application for Blehprint, built with React Router v7 and deployed to Cloudflare Workers.

## Tech Stack

- **Framework:** [React Router v7](https://reactrouter.com) — Full-stack React framework with SSR
- **Runtime:** [Cloudflare Workers](https://workers.cloudflare.com) — Edge-first serverless compute
- **UI:** [@blehprint/ui](../../packages/ui) — Shared component library
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)

## Project Structure

```
workers/web/
├── app/
│   ├── routes/          # Route modules (loaders, actions, meta)
│   ├── pages/           # Pure React page components
│   ├── utils/           # Shared utilities
│   ├── root.tsx         # Root layout component
│   ├── routes.ts        # Route configuration
│   ├── app.css          # Global styles
│   └── entry.*.ts       # Entry points (client, server, worker)
├── public/              # Static assets
├── wrangler.jsonc       # Cloudflare Workers config
└── vite.config.ts       # Vite configuration
```

### `routes/` — Server Logic & Data Flow

Route files handle all the heavy lifting:

- **`loader`** — Server-side data fetching, authentication checks, redirects
- **`action`** — Form submissions, mutations, API calls
- **`meta`** — Page title and SEO metadata
- **Default export** — Thin wrapper that passes loader data to page components

```tsx
// routes/home.tsx
import { HomePage } from "../pages/home";

export function meta() {
  return [{ title: "Home" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  return { session };
}

export default function HomeRoute({ loaderData }: Route.ComponentProps) {
  return <HomePage session={loaderData.session} />;
}
```

### `pages/` — Pure React Components

Page files contain only presentational React components:

- **No server code** — No loaders, actions, or server imports
- **Props-driven** — Receive all data via props from route files
- **Focused on UI** — Layout, styling, and user interactions
- **Easily testable** — Can be rendered in isolation with mock props

```tsx
// pages/home.tsx
export function HomePage({ session }: { session: SessionData }) {
  return (
    <main>
      <h1>Welcome, {session?.user.name ?? "Guest"}</h1>
    </main>
  );
}
```

## Development

Start the development server:

```bash
# From the monorepo root
bun run dev:web

# Or from this directory
bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Using UI Components

Import components from the shared UI package:

```tsx
import { Button } from "@blehprint/ui/components/button";
import { cn } from "@blehprint/ui/lib/utils";

export function MyPage() {
  return (
    <div className={cn("container", "py-8")}>
      <Button>Click me</Button>
    </div>
  );
}
```

The global styles are already imported in `app/app.css`.

## Building for Production

```bash
bun run build
```

## Deployment

Deploy to Cloudflare Workers:

```bash
# From the monorepo root
bun run deploy:web

# Or from this directory
bun run deploy
```

## Environment Variables

Copy the example environment file:

```bash
cp .dev.vars.example .dev.vars
```

Required variables:

| Variable | Description |
|----------|-------------|
| `BETTER_AUTH_SECRET` | Secret key for BetterAuth sessions |

For production, set secrets using Wrangler:

```bash
bunx wrangler secret put BETTER_AUTH_SECRET
```

## License

MIT
