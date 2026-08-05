import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/session";
import type { AuthUser } from "@/features/auth/types";

/**
 * Shared plumbing for the family and progress route handlers.
 *
 * Responses never cache (they are per-parent, private data), and every handler
 * begins by resolving the signed-in parent — the routes are already behind the
 * middleware gate, but the service needs the real user, and defence in depth is
 * cheap here.
 */

const noStore = { "cache-control": "no-store" } as const;

export function jsonResponse(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: noStore });
}

export function unauthorized(): NextResponse {
  return jsonResponse({ error: "unauthorized" }, 401);
}

export function notFoundResponse(): NextResponse {
  return jsonResponse({ error: "not-found" }, 404);
}

export function badRequest(reason = "invalid"): NextResponse {
  return jsonResponse({ error: reason }, 400);
}

/** The signed-in parent, or null when there is no valid session. */
export function currentUser(): Promise<AuthUser | null> {
  return getSessionUser();
}

/** Reads a JSON body, or `undefined` when it is missing or malformed. */
export async function readJsonBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) return undefined;
  try {
    return (await request.json()) as unknown;
  } catch {
    return undefined;
  }
}
