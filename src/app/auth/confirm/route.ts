import { NextResponse } from "next/server";
import { safeNextPath } from "@/features/auth/http";
import { getServerAuthGateway } from "@/features/auth/session";

/**
 * The landing point for emailed links (confirmation and password reset).
 *
 * Supabase sends the parent here with a one-time `code`. We exchange it for a
 * session server-side and then continue to wherever the link was for — the
 * parent area after a sign-up confirmation, or the reset page after a recovery
 * link (its `next` is carried on the URL). A missing or spent code just returns
 * the parent to `/login`; the copy there never says why, by design.
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));

  if (code === null || code === "") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const gateway = await getServerAuthGateway();
  const result = await gateway.exchangeCodeForSession(code);
  if (!result.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
