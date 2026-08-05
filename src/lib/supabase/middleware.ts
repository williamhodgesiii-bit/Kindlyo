import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { AuthUser } from "@/features/auth/types";
import { env } from "@/lib/env";

/**
 * Refreshes the Supabase session for a request and reports who is signed in.
 *
 * This is the documented `@supabase/ssr` middleware dance: build a client bound
 * to the request cookies, let it rotate the auth tokens, and carry the updated
 * cookies out on the response. `getUser()` is used rather than `getSession()`
 * because it revalidates the token against Supabase — the only check safe to
 * gate on.
 */
export async function updateSupabaseSession(
  request: NextRequest,
): Promise<{ response: NextResponse; user: AuthUser | null }> {
  let response = NextResponse.next({ request });

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url === null || anonKey === null) {
    return { response, user: null };
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const supabaseUser = data.user;
  const user =
    supabaseUser !== null &&
    typeof supabaseUser.email === "string" &&
    supabaseUser.email !== ""
      ? { id: supabaseUser.id, email: supabaseUser.email }
      : null;

  return { response, user };
}
