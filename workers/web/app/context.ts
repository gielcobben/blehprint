import { createContext } from "react-router";

/**
 * Cloudflare bindings and execution context for the current request.
 *
 *   const { ctx } = context.get(cloudflareContext);
 *   ctx.waitUntil(doSomethingAfterResponse());
 *
 * For bindings alone, `import { env } from "cloudflare:workers"` is shorter.
 */
export const cloudflareContext = createContext<{
  env: Cloudflare.Env;
  ctx: ExecutionContext;
}>();
