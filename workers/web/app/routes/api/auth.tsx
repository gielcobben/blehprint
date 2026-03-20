import type { Route } from "./+types/auth";
import { proxyAuthRequest } from "~/utils/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  return proxyAuthRequest(request);
}

export async function action({ request }: Route.ActionArgs) {
  return proxyAuthRequest(request);
}
