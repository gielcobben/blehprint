# @blehprint/auth

Authentication package powered by [BetterAuth](https://better-auth.com), configured for Cloudflare D1.

## Features

- Email & password authentication
- Session management with cookie caching
- Route protection with automatic redirects
- Type-safe session data

## Installation

This package is included in the monorepo. It depends on `@blehprint/database` for schema and database access.

## Usage

### Creating an Auth Instance

```typescript
import { createAuth } from "@blehprint/auth";

const auth = createAuth(env.DB, env.BETTER_AUTH_SECRET);
```

### Getting the Current Session

Returns `null` if not authenticated:

```typescript
import { getSession } from "@blehprint/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request, env.DB, env.BETTER_AUTH_SECRET);

  if (session) {
    return { user: session.user };
  }

  return { user: null };
}
```

### Requiring Authentication

Automatically redirects to `/login` if not authenticated:

```typescript
import { requireAuth } from "@blehprint/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireAuth(request, env.DB, env.BETTER_AUTH_SECRET);

  // session is guaranteed to be non-null here
  return { user: session.user };
}
```

Custom redirect path:

```typescript
const session = await requireAuth(
  request,
  env.DB,
  env.BETTER_AUTH_SECRET,
  "/sign-in"
);
```

### Handling Auth API Routes

Mount the BetterAuth handler in your routes:

```typescript
// app/routes/auth.tsx
import { createAuth } from "@blehprint/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const auth = createAuth(env.DB, env.BETTER_AUTH_SECRET);
  return auth.handler(request);
}

export async function action({ request }: ActionFunctionArgs) {
  const auth = createAuth(env.DB, env.BETTER_AUTH_SECRET);
  return auth.handler(request);
}
```

## Configuration

### Environment Variables

| Variable             | Description                     |
| -------------------- | ------------------------------- |
| `BETTER_AUTH_SECRET` | Secret key for signing sessions |

Generate a secure secret:

```bash
openssl rand -base64 32
```

### Session Settings

Sessions are cached in cookies for 5 minutes by default to reduce database lookups:

```typescript
session: {
  cookieCache: {
    enabled: true,
    maxAge: 60 * 5, // 5 minutes
  },
}
```

## Exports

### Functions

| Export        | Description                                           |
| ------------- | ----------------------------------------------------- |
| `createAuth`  | Create a BetterAuth instance for D1                   |
| `getSession`  | Get current session (returns null if unauthenticated) |
| `requireAuth` | Require authentication or redirect                    |

### Types

| Export         | Description                          |
| -------------- | ------------------------------------ |
| `AuthInstance` | Type of the BetterAuth instance      |
| `SessionData`  | Type of session data from getSession |

## Client-Side Usage

For client-side auth (sign up, sign in, sign out), use BetterAuth's React client:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

// Sign up
await authClient.signUp.email({
  email: "user@example.com",
  password: "password",
  name: "User Name",
});

// Sign in
await authClient.signIn.email({
  email: "user@example.com",
  password: "password",
});

// Sign out
await authClient.signOut();
```

## Related

- [BetterAuth Documentation](https://better-auth.com/docs)
- [@blehprint/database](../database/readme.md) — Database schema
