import { CheckEmailPage } from "~/pages/auth/check-email";
import type { Route } from "./+types/check-email";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Check your email" }];
}

export function loader({ url }: Route.LoaderArgs) {
  return { reason: url.searchParams.get("for") === "reset" ? "reset" : "verify" } as const;
}

export default function CheckEmailRoute({ loaderData }: Route.ComponentProps) {
  return <CheckEmailPage reason={loaderData.reason} />;
}
