import { applyD1Migrations } from "cloudflare:test";
import { env } from "cloudflare:workers";

declare module "cloudflare:workers" {
  interface ProvidedEnv extends Cloudflare.Env {
    TEST_MIGRATIONS: D1Migration[];
  }
}

await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
