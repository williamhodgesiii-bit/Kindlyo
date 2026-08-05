/**
 * The offline development session, signed.
 *
 * This is the auth equivalent of the local prototype profile store and the
 * waitlist log sink: a stand-in that lets the app run, and the whole test
 * suite pass, with no network and no Supabase project. It is **not a security
 * control** and it is **only ever used in the `local` environment** — env
 * validation requires real Supabase in preview and production, and
 * `assertLocalAuthAllowed` refuses to run anywhere else.
 *
 * A session is a tiny JSON payload carried in a cookie and HMAC-signed so that a
 * hand-typed value cannot mint one. The signing uses Web Crypto so the same code
 * runs in a route handler (Node) and in middleware (edge). The secret is a fixed
 * development constant on purpose: there is nothing real to protect here, and a
 * per-machine secret would only make the offline flow flakier.
 */

import type { AppEnvironment } from "@/lib/env";
import type { AuthUser } from "./types";

export type LocalSession = { id: string; email: string };

/** Not a secret: this path is dev-only and cannot run in a deployed environment. */
const DEV_SIGNING_SECRET = "kindlyo.local.dev.not-a-secret";

/** A stable, meaningless id derived from the email, so tests are deterministic. */
export function localUserId(email: string): string {
  return `local:${email.toLowerCase()}`;
}

export function assertLocalAuthAllowed(appEnv: AppEnvironment): void {
  if (appEnv !== "local") {
    throw new Error(
      "The local auth stand-in is only available when APP_ENV is 'local'. " +
        "Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function hmac(message: string, secret: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );
  return new Uint8Array(signature);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return diff === 0;
}

function isLocalSession(value: unknown): value is LocalSession {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).id === "string" &&
    typeof (value as Record<string, unknown>).email === "string"
  );
}

/** Produces the signed cookie value for a session. */
export async function signSession(
  session: LocalSession,
  secret: string = DEV_SIGNING_SECRET,
): Promise<string> {
  const payload = bytesToBase64Url(
    new TextEncoder().encode(JSON.stringify(session)),
  );
  const signature = bytesToBase64Url(await hmac(payload, secret));
  return `${payload}.${signature}`;
}

/** Verifies a signed cookie value, returning the session or null if it is not valid. */
export async function verifySession(
  token: string | undefined,
  secret: string = DEV_SIGNING_SECRET,
): Promise<LocalSession | null> {
  if (token === undefined || token === "") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  if (payload === undefined || signature === undefined) return null;

  // Everything past here decodes attacker-controlled base64: a malformed
  // signature or payload must fail closed (null), never throw.
  try {
    const expected = bytesToBase64Url(await hmac(payload, secret));
    if (
      !timingSafeEqual(base64UrlToBytes(signature), base64UrlToBytes(expected))
    ) {
      return null;
    }

    const decoded: unknown = JSON.parse(
      new TextDecoder().decode(base64UrlToBytes(payload)),
    );
    return isLocalSession(decoded) ? decoded : null;
  } catch {
    return null;
  }
}

export function toAuthUser(session: LocalSession): AuthUser {
  return { id: session.id, email: session.email };
}
