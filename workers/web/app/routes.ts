import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // Application
  index("routes/home.tsx"),

  // Auth
  layout("routes/auth/layout.tsx", [
    route("/auth/login", "routes/auth/login.tsx"),
    route("/auth/signup", "routes/auth/signup.tsx"),
  ]),

  // API
  route("api/auth/*", "routes/api/auth.tsx"),
] satisfies RouteConfig;
