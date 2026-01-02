import type { RequestHandler } from "react-router";
import { createRequestHandler, RouterContextProvider } from "react-router";

let handler: RequestHandler | null = null;

export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    // Dynamically import React Router server build
    // This helps reduce worker init time
    let build = await import("virtual:react-router/server-build");
    // Only create a request handler if `handler` is still null (first request)
    if (handler === null) handler = createRequestHandler(build);

    // Create a new router context for each request
    let context = new RouterContextProvider();

    // Call the handler with the request and context and return the response
    return await handler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Cloudflare.Env>;
