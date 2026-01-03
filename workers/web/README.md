# Web Worker

The main web application for Blehprint, built with React Router v7 and deployed to Cloudflare Workers.

## Tech Stack

- **Framework:** [React Router v7](https://reactrouter.com) — Full-stack React framework with SSR
- **Runtime:** [Cloudflare Workers](https://workers.cloudflare.com) — Edge-first serverless compute
- **UI:** [@blehprint/ui](../packages/ui) — Shared component library
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)

## Development

Start the development server:

```bash
# From the monorepo root
bun run dev:web

# Or from this directory
bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
workers/web/
├── app/
│   ├── routes/          # React Router route modules
│   ├── pages/           # Page components
│   ├── root.tsx         # Root layout component
│   ├── routes.ts        # Route configuration
│   ├── app.css          # Global styles
│   └── entry.*.ts       # Entry points (client, server, worker)
├── public/              # Static assets
├── wrangler.jsonc       # Cloudflare Workers config
└── vite.config.ts       # Vite configuration
```

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
