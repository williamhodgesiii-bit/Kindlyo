import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stripe webhook signature verification.
 *
 * A webhook is an unauthenticated POST that we nonetheless act on, so it must be
 * proven to come from Stripe before a single byte is trusted (docs/BILLING.md).
 * Stripe signs each delivery with the endpoint's signing secret; this verifies
 * that signature.
 *
 * Hand-rolled rather than pulling in the Stripe SDK, matching the codebase's
 * "avoid unnecessary dependencies" posture (CLAUDE.md) and the existing
 * hand-rolled HMAC session signing in `src/features/auth/localSession.ts`. This
 * is standard HMAC-SHA256 verification — not home-grown cryptography — and it is
 * kept pure and fully unit-tested precisely because it is the security boundary.
 * Card data never passes through here or anywhere in the app: that stays inside
 * Stripe Checkout and the Billing Portal.
 *
 * The `Stripe-Signature` header looks like:
 *   t=1614556800,v1=hex...,v1=hex...,v0=...
 * We recompute HMAC-SHA256 of `${t}.${payload}` with the signing secret and
 * compare it, in constant time, against each `v1` scheme. A timestamp tolerance
 * rejects replays of an old delivery.
 */

export type SignatureVerification =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "missing-header"
        | "missing-secret"
        | "malformed-header"
        | "no-match"
        | "timestamp-out-of-tolerance";
    };

/** Stripe's default tolerance for the signature timestamp: five minutes. */
export const DEFAULT_TOLERANCE_SECONDS = 300;

type ParsedHeader = { timestamp: number; signatures: string[] };

function parseHeader(header: string): ParsedHeader | null {
  let timestamp: number | null = null;
  const signatures: string[] = [];

  for (const part of header.split(",")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key === "t") {
      const parsed = Number.parseInt(value, 10);
      if (Number.isFinite(parsed)) timestamp = parsed;
    } else if (key === "v1") {
      signatures.push(value);
    }
  }

  if (timestamp === null || signatures.length === 0) return null;
  return { timestamp, signatures };
}

/** Constant-time hex comparison that first rejects a length mismatch safely. */
function secureEqualHex(expected: string, candidate: string): boolean {
  let expectedBuffer: Buffer;
  let candidateBuffer: Buffer;
  try {
    expectedBuffer = Buffer.from(expected, "hex");
    candidateBuffer = Buffer.from(candidate, "hex");
  } catch {
    return false;
  }
  if (
    expectedBuffer.length === 0 ||
    expectedBuffer.length !== candidateBuffer.length
  ) {
    return false;
  }
  return timingSafeEqual(expectedBuffer, candidateBuffer);
}

/**
 * Computes the hex HMAC-SHA256 Stripe expects for a payload at a timestamp.
 * Exported so development tooling can produce valid test deliveries; production
 * code only ever verifies.
 */
export function computeStripeSignature(
  payload: string,
  secret: string,
  timestamp: number,
): string {
  return createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`, "utf8")
    .digest("hex");
}

export function verifyStripeSignature(options: {
  payload: string;
  header: string | null;
  secret: string;
  toleranceSeconds?: number;
  /** Injectable clock (seconds since epoch) for deterministic tests. */
  nowSeconds?: number;
}): SignatureVerification {
  const {
    payload,
    header,
    secret,
    toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
    nowSeconds = Math.floor(Date.now() / 1000),
  } = options;

  if (secret === "") return { ok: false, reason: "missing-secret" };
  if (header === null || header === "") {
    return { ok: false, reason: "missing-header" };
  }

  const parsed = parseHeader(header);
  if (parsed === null) return { ok: false, reason: "malformed-header" };

  if (Math.abs(nowSeconds - parsed.timestamp) > toleranceSeconds) {
    return { ok: false, reason: "timestamp-out-of-tolerance" };
  }

  const expected = computeStripeSignature(payload, secret, parsed.timestamp);
  const matched = parsed.signatures.some((candidate) =>
    secureEqualHex(expected, candidate),
  );
  return matched ? { ok: true } : { ok: false, reason: "no-match" };
}
