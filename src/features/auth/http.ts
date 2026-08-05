import { NextResponse } from "next/server";

/**
 * Shared helpers for the auth route handlers.
 *
 * The same shape the waitlist endpoint uses: no-store JSON responses, a
 * best-effort client key for rate limiting, and one place that decides what a
 * "safe" post-login redirect target is. Keeping these here stops four routes
 * from copying the boilerplate and drifting apart.
 */

export const noStore = { "cache-control": "no-store" } as const;

/**
 * Best effort, and spoofable. Only used to bucket a rate limit, never to store
 * or identify anyone — same caveat as the waitlist endpoint.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first !== undefined && first !== "" ? first : "unknown";
}

export function jsonError(
  issues: string[],
  status: number,
  extra?: HeadersInit,
): NextResponse {
  return NextResponse.json(
    { ok: false, issues },
    { status, headers: { ...noStore, ...extra } },
  );
}

export function jsonOk(body: Record<string, unknown> = {}): NextResponse {
  return NextResponse.json(
    { ok: true, ...body },
    { status: 200, headers: noStore },
  );
}

/**
 * Prevents an open redirect: only a same-origin *relative* path is allowed
 * through, so `?redirectTo=https://evil.example` or `//evil.example` falls back
 * to the parent area.
 */
export function safeNextPath(
  value: string | null | undefined,
  fallback = "/parent",
): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

/** Reads one field from an already-parsed JSON body without asserting its type. */
export function bodyField(body: unknown, key: string): unknown {
  return typeof body === "object" && body !== null
    ? (body as Record<string, unknown>)[key]
    : undefined;
}

export type JsonBodyResult =
  { ok: true; body: unknown } | { ok: false; response: NextResponse };

/** Validates content-type and size, then parses JSON, mirroring the waitlist route. */
export async function readJsonBody(
  request: Request,
  maxBytes = 2_000,
): Promise<JsonBodyResult> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return {
      ok: false,
      response: jsonError(["Expected a JSON request body."], 415),
    };
  }

  const raw = await request.text();
  if (raw.length > maxBytes) {
    return {
      ok: false,
      response: jsonError(["That request was too large."], 413),
    };
  }

  try {
    return { ok: true, body: JSON.parse(raw) };
  } catch {
    return {
      ok: false,
      response: jsonError(["That request body was not valid JSON."], 400),
    };
  }
}
