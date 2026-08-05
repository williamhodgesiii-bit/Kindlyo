import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/**
 * A request-scoped Supabase client for server components, route handlers, and
 * server actions.
 *
 * Reads and writes the auth cookies through Next's cookie store, which is what
 * gives `@supabase/ssr` its httpOnly, rotating session. The `setAll` write is
 * wrapped in try/catch because a Server Component render cannot set cookies;
 * there the middleware is responsible for refreshing them instead.
 *
 * Callers reach this only when `env.authConfigured` is true (see
 * `getServerAuthGateway`), so the missing-config throw is a guard, not a path
 * the app takes in normal operation.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url === null || anonKey === null) {
    throw new Error("Supabase is not configured.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component render: cookies are read-only here. The middleware
          // session refresh writes them instead.
        }
      },
    },
  });
}
