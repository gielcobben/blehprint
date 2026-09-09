import { createRequestHandler, RouterContextProvider } from "react-router";
import { cloudflareContext } from "./context";

const handler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  fetch(request, env, ctx) {
    const context = new RouterContextProvider();
    context.set(cloudflareContext, { env, ctx });

    return handler(request, context);
  },
} satisfies ExportedHandler<Cloudflare.Env>;
