import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AuthGateway } from "./gateway";
import { createLocalGateway, type SessionCookieStore } from "./localGateway";
import { createSupabaseGateway } from "./supabaseGateway";
import type { AuthUser } from "./types";

/**
 * How the app gets at authentication from the server.
 *
 * One decision point — `env.authConfigured` — chooses the real Supabase gateway
 * or the local development stand-in. Everything above this line (layouts, route
 * handlers, the middleware) talks to the `AuthGateway` interface and never needs
 * to know which one it got.
 */

/** One week; the session cookie is refreshed on use. */
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * Wraps Next's route-handler cookie store as the minimal surface the local
 * gateway needs, baking in the httpOnly/secure/sameSite policy in one place.
 */
function nextCookieStore(
  store: Awaited<ReturnType<typeof cookies>>,
): SessionCookieStore {
  const secure = env.APP_ENV !== "local";
  return {
    get: (name) => store.get(name)?.value,
    set: (name, value) =>
      store.set(name, value, {
        httpOnly: true,
        sameSite: "lax",
        secure,
        path: "/",
        maxAge: SESSION_MAX_AGE_SECONDS,
      }),
    remove: (name) =>
      store.set(name, "", {
        httpOnly: true,
        sameSite: "lax",
        secure,
        path: "/",
        maxAge: 0,
      }),
  };
}

/**
 * The auth gateway for a server component, route handler, or server action.
 * Writes (sign-in, sign-out) only take effect from a route handler or action,
 * where the cookie store is mutable.
 */
export async function getServerAuthGateway(): Promise<AuthGateway> {
  if (env.authConfigured) {
    return createSupabaseGateway(await createSupabaseServerClient());
  }
  return createLocalGateway(nextCookieStore(await cookies()));
}

/** The signed-in parent for the current request, or null. */
export async function getSessionUser(): Promise<AuthUser | null> {
  return (await getServerAuthGateway()).getUser();
}
