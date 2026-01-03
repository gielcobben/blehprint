import { HomePage } from "../pages/home";
import type { Route } from "./+types/home";
import { database } from "@blehprint/database";
import { env } from "cloudflare:workers";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "New Blehprint" },
    { name: "description", content: "Welcome to Blehprint!" },
  ];
}

export async function loader() {
  const db = database(env.DB);
  const users = await db.query.user.findMany();

  return { users };
}

export default function Home({ loaderData: { users } }: Route.ComponentProps) {
  return <HomePage users={users} />;
}
