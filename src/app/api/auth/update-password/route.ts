import { rateLimitedError } from "@/features/auth/errors";
import {
  bodyField,
  clientKey,
  jsonError,
  jsonOk,
  readJsonBody,
} from "@/features/auth/http";
import { getServerAuthGateway } from "@/features/auth/session";
import { parseNewPassword } from "@/features/auth/validate";
import { createFixedWindowLimiter } from "@/features/waitlist/rateLimit";

/**
 * Set a new password.
 *
 * Reached from the reset link: `/auth/confirm` exchanges the emailed code for a
 * short-lived recovery session first, and this endpoint updates the password
 * within it. Without that session the provider rejects the change, which is why
 * a stale or replayed link simply fails generically.
 */

export const dynamic = "force-dynamic";

const limiter = createFixedWindowLimiter({ limit: 10, windowMs: 60_000 });

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const decision = limiter.check(clientKey(request));
  if (!decision.allowed) {
    return jsonError([rateLimitedError], 429, {
      "retry-after": String(decision.retryAfterSeconds),
    });
  }

  const password = parseNewPassword(bodyField(body.body, "password"));
  if (!password.ok) return jsonError(password.issues, 400);

  const gateway = await getServerAuthGateway();
  const result = await gateway.updatePassword(password.value);
  if (!result.ok) return jsonError([result.message], 400);

  return jsonOk({ next: "/parent" });
}
