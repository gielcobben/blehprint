import { getSession } from "~/utils/auth.server";
import { HomePage } from "../pages/home";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "New Blehprint" },
    { name: "description", content: "Welcome to Blehprint!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  return { session: session };
}

export default function HomeRoute({
  loaderData: { session },
}: Route.ComponentProps) {
  return <HomePage session={session} />;
}
