# @blehprint/ui

A shared UI component library for the Blehprint monorepo, built on [shadcn/ui](https://ui.shadcn.com) with the [Base UI](https://base-ui.com) adapter.

## Tech Stack

- **Component System:** [shadcn/ui](https://ui.shadcn.com) with Base UI variant
- **Primitives:** [@base-ui/react](https://base-ui.com) — Unstyled, accessible UI primitives
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) with CSS variables
- **Utilities:** [class-variance-authority](https://cva.style) + [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **Icons:** [Lucide React](https://lucide.dev)

## Package Exports

```typescript
// Components
import { Button } from "@blehprint/ui/components/button";

// Utilities
import { cn } from "@blehprint/ui/lib/utils";

// Styles (import in your app's CSS entry point)
@import "@blehprint/ui/styles/globals.css";
```

## Adding Components

Use the shadcn CLI to add components to this package:

```bash
# Navigate to the UI package
cd packages/ui

# Add a component
bunx shadcn@latest add button

# Add multiple components
bunx shadcn@latest add button card input
```

Components will be installed to `src/components/` and can be imported using the package exports.

### Available Components

Browse all available components at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components).

## Using in the Web App

### 1. Import the global styles

Add the UI package styles to your app's CSS entry point:

```css
/* workers/web/app/app.css */
@import "tailwindcss";
@import "@blehprint/ui/styles/globals.css";
```

### 2. Import and use components

```tsx
import { Button } from "@blehprint/ui/components/button";

export function MyComponent() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  );
}
```

## Theming

The package uses CSS variables for theming, supporting both light and dark modes. Variables are defined in `src/styles/globals.css` using the OKLCH color space.

### Color Variables

| Variable        | Description         |
| --------------- | ------------------- |
| `--background`  | Page background     |
| `--foreground`  | Default text color  |
| `--primary`     | Primary brand color |
| `--secondary`   | Secondary color     |
| `--muted`       | Muted backgrounds   |
| `--accent`      | Accent highlights   |
| `--destructive` | Error/danger color  |
| `--border`      | Border color        |
| `--input`       | Input field borders |
| `--ring`        | Focus ring color    |

### Dark Mode

Dark mode is activated by adding the `dark` class to a parent element:

```tsx
<html className="dark">{/* Your app */}</html>
```

### Customizing Theme

Edit `src/styles/globals.css` to customize the color palette:

```css
:root {
  --primary: oklch(0.5 0.2 250); /* Custom blue */
  --radius: 0.5rem; /* Adjust border radius */
}
```

## Utilities

### `cn()` — Class Name Merger

Combines class names with Tailwind merge support:

```tsx
import { cn } from "@blehprint/ui/lib/utils";

<div className={cn("base-classes", isActive && "active-classes", className)} />;
```

## Project Structure

```
packages/ui/
├── src/
│   ├── components/    # shadcn/ui components
│   ├── hooks/         # Shared React hooks
│   ├── lib/
│   │   └── utils.ts   # Utility functions (cn, etc.)
│   └── styles/
│       └── globals.css # Theme variables & base styles
├── components.json    # shadcn/ui configuration
├── package.json
└── tsconfig.json
```

## License

MIT
