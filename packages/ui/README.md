# @blehprint/ui

[shadcn/ui](https://ui.shadcn.com) components on [Base UI](https://base-ui.com) primitives with Tailwind CSS v4.

```tsx
import { Button } from "@blehprint/ui/components/button";
import { cn } from "@blehprint/ui/lib/utils";
```

```css
/* app.css */
@import "@blehprint/ui/styles/globals.css";
@source "../node_modules/@blehprint/ui/src/**/*.tsx";
```

## Adding components

```bash
bun run ui:add card dialog   # from the repo root
```

Components land in `src/components/` and import each other by package name (`@blehprint/ui/...`). That is shadcn's monorepo alias style and lets every consumer compile them without extra path config.

## Theming

`src/styles/globals.css` defines the color tokens in OKLCH for light and dark. Dark mode is the `dark` class on `<html>`, which `remix-themes` toggles in the web app.

## Exports

| Path                          | Contents                     |
| ----------------------------- | ---------------------------- |
| `@blehprint/ui/components/*`  | `src/components/*.tsx`       |
| `@blehprint/ui/lib/*`         | `src/lib/*.ts` (`cn`)        |
| `@blehprint/ui/hooks/*`       | `src/hooks/*.ts`             |
| `@blehprint/ui/styles/*.css`  | `src/styles/*.css`           |
