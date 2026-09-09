/**
 * Only allow same-site paths as a redirect target, so a crafted link cannot
 * bounce a user to another site after logging in.
 */
export function safeRedirect(to: string | null | undefined, fallback = "/") {
  if (!to || !to.startsWith("/") || to.startsWith("//") || to.startsWith("/\\")) return fallback;
  return to;
}
