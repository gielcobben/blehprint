# Web worker

[React Router 8](https://reactrouter.com) in framework mode, server-rendered on Cloudflare Workers via the Cloudflare Vite plugin.

```
workers/web/
├── app/
│   ├── routes/          # loaders, actions, meta, thin default exports
│   ├── pages/           # plain React components, props in, no server code
│   ├── utils/
│   │   ├── auth.server.ts   # api(), post(), getSession(), requireSession(), redirectWithCookies()
│   │   ├── redirect.ts      # safeRedirect()
│   │   ├── theme.server.ts  # theme cookie
│   │   └── form.ts          # useIsPending()
│   ├── context.ts       # cloudflareContext for loaders that need ctx.waitUntil
│   ├── entry.worker.ts  # Worker fetch handler
│   ├── root.tsx         # document, theme provider, error boundary
│   ├── routes.ts        # route table
│   └── app.css          # Tailwind entry, imports @blehprint/ui styles
├── test/                # Vitest unit tests (node)
├── wrangler.jsonc       # service binding to the API worker
└── vite.config.ts       # cloudflare() with auxiliaryWorkers, tailwindcss(), reactRouter()
```

## Routes and pages

A route file does the server work and hands props to a page:

```tsx
// routes/home.tsx
export async function loader({ request }: Route.LoaderArgs) {
  return { session: await getSession(request) };
}
export default function HomeRoute({ loaderData }: Route.ComponentProps) {
  return <HomePage session={loaderData.session} />;
}
```

```tsx
// pages/home.tsx
export function HomePage({ session }: { session: Session | null }) { … }
```

Pages never import server code, so they can be rendered and tested in isolation. Form schemas (Zod) live next to the page that renders the form and are shared with the route's action.

## Talking to the API

`app/utils/auth.server.ts` wraps the service binding:

```ts
const res = await post(request, "/v1/auth/sign-in/email", { email, password });
if (!res.ok) return submission.reply({ formErrors: [await errorMessage(res)] });
return redirectWithCookies("/", res); // copies Set-Cookie from the API to the browser
```

Bindings come from `import { env } from "cloudflare:workers"`. For `ctx.waitUntil`, read `context.get(cloudflareContext)` in a loader.

## Auth pages

| Path                          | Purpose                                    |
| ----------------------------- | ------------------------------------------ |
| `/auth/login`                 | Accepts `?redirectTo=/path` (same-site only) |
| `/auth/signup`                | Then `/auth/check-email?for=verify`        |
| `/auth/verify-email?token=`   | Link from the email; redirects to login    |
| `/auth/forgot-password`       | Then `/auth/check-email?for=reset`         |
| `/auth/reset-password/:token` | Link from the email                        |
| `/auth/logout`                | Clears the session                         |

## Scripts

| Command             | What it does                                                  |
| ------------------- | ------------------------------------------------------------- |
| `bun run dev`       | Vite dev server with the API as an auxiliary worker           |
| `bun run test`      | Vitest unit tests                                             |
| `bun run typecheck` | `wrangler types`, `react-router typegen`, then `tsc`          |
| `bun run build`     | Production build to `build/`                                  |
| `bun run deploy`    | Build and `wrangler deploy`                                   |

## Theme

`remix-themes` with a cookie. Toggle from any component:

```tsx
const [theme, setTheme] = useTheme();
```
