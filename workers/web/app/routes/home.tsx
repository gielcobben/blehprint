import { HomePage } from "~/pages/home";
import { getSession } from "~/utils/auth.server";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Blehprint" }, { name: "description", content: "Welcome to Blehprint" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  return { session: await getSession(request) };
}

export default function HomeRoute({ loaderData }: Route.ComponentProps) {
  return <HomePage session={loaderData.session} />;
}
