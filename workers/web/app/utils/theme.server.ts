import { createCookieSessionStorage } from "react-router";
import { createThemeSessionResolver } from "remix-themes";

/**
 * Stores the light/dark preference in a cookie. The cookie is unsigned on
 * purpose: a theme preference is not sensitive and needs no secret.
 */
const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
  },
});

export const themeSessionResolver = createThemeSessionResolver(themeStorage);
