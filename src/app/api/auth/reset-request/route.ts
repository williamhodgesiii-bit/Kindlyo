import { rateLimitedError } from "@/features/auth/errors";
import {
  bodyField,
  clientKey,
  jsonError,
  jsonOk,
  readJsonBody,
} from "@/features/auth/http";
import { getServerAuthGateway } from "@/features/auth/session";
import { parseEmail } from "@/features/auth/validate";
import { createFixedWindowLimiter } from "@/features/waitlist/rateLimit";

/**
 * Request a password-reset link.
 *
 * The strongest anti-enumeration stance: on any well-formed address this returns
 * the same `200` whether or not an account exists, and the form shows the same
 * "if that address has an account…" message either way. The only visible
 * difference is the rate-limit `429`, which reveals nothing about the address.
 */

export const dynamic = "force-dynamic";

const limiter = createFixedWindowLimiter({ limit: 5, windowMs: 60_000 });

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const decision = limiter.check(clientKey(request));
  if (!decision.allowed) {
    return jsonError([rateLimitedError], 429, {
      "retry-after": String(decision.retryAfterSeconds),
    });
  }

  const email = parseEmail(bodyField(body.body, "email"));
  if (!email.ok) return jsonError(email.issues, 400);

  // Fire and forget: the result is deliberately not reflected to the client.
  const gateway = await getServerAuthGateway();
  await gateway.requestPasswordReset(email.value);

  return jsonOk();
}
