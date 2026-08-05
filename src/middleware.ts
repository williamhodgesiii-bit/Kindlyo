import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/features/auth/localGateway";
import { toAuthUser, verifySession } from "@/features/auth/localSession";
import type { AuthUser } from "@/features/auth/types";
import { env } from "@/lib/env";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

/**
 * The route gate.
 *
 * Both the parent area and the child learning area are reachable only from a
 * signed-in parent's session (decision 001): the child surface has no login of
 * its own, it is entered from the parent's. An unauthenticated request to either
 * is sent to `/login`, remembering where it was headed.
 *
 * The middleware also refreshes the Supabase session on the way through, which
 * is why it runs even for requests that are already authenticated. When Supabase
 * is not configured (local development), the same gate reads the signed
 * stand-in cookie instead — see `src/features/auth`.
 */

const PROTECTED_PREFIXES = ["/parent", "/learn"] as const;

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  let response: NextResponse;
  let user: AuthUser | null;

  if (env.authConfigured) {
    const result = await updateSupabaseSession(request);
    response = result.response;
    user = result.user;
  } else {
    response = NextResponse.next({ request });
    const session = await verifySession(
      request.cookies.get(SESSION_COOKIE_NAME)?.value,
    );
    user = session === null ? null : toAuthUser(session);
  }

  if (user === null && isProtectedPath(request.nextUrl.pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "redirectTo",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/parent", "/parent/:path*", "/learn", "/learn/:path*"],
};
