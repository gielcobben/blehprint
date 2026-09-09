// Secrets are not in wrangler.jsonc, so declare them here to keep `Cloudflare.Env` complete.
// Set locally in .dev.vars and in production with `wrangler secret put`.
declare namespace Cloudflare {
  interface Env {
    BETTER_AUTH_SECRET: string;
  }
}
