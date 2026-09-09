import { index, layout, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  layout("routes/auth/layout.tsx", [
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/signup", "routes/auth/signup.tsx"),
    route("auth/logout", "routes/auth/logout.tsx"),
    route("auth/forgot-password", "routes/auth/forgot-password.tsx"),
    route("auth/reset-password/:token", "routes/auth/reset-password.tsx"),
    route("auth/check-email", "routes/auth/check-email.tsx"),
    route("auth/verify-email", "routes/auth/verify-email.tsx"),
  ]),

  route("api/theme", "routes/api/theme.tsx"),
] satisfies RouteConfig;
