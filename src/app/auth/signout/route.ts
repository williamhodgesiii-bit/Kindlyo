import { NextResponse } from "next/server";
import { getServerAuthGateway } from "@/features/auth/session";

/**
 * Sign out.
 *
 * A POST, not a GET, so a link prefetch or an embedded image can never end a
 * parent's session. It clears the session cookies through the gateway and sends
 * the parent back to the public homepage. The `ParentAccountBar` posts here with
 * a plain form, so it works with scripting unavailable.
 */

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const gateway = await getServerAuthGateway();
  await gateway.signOut();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
