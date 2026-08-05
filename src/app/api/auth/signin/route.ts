import { rateLimitedError } from "@/features/auth/errors";
import {
  clientKey,
  jsonError,
  jsonOk,
  readJsonBody,
  safeNextPath,
} from "@/features/auth/http";
import { getServerAuthGateway } from "@/features/auth/session";
import { parseSignInCredentials } from "@/features/auth/validate";
import { createFixedWindowLimiter } from "@/features/waitlist/rateLimit";

/**
 * Parent sign-in.
 *
 * Validates the shape of the input with the same parser the form uses, then
 * hands the credentials to whichever gateway is configured. A wrong password and
 * an unknown account both return the one generic message (`401`), so the
 * endpoint cannot be used to enumerate addresses. The in-process limiter is
 * defense in depth on top of Supabase's own limits — honest about being
 * per-process (decision 030), not a security boundary.
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

  const parsed = parseSignInCredentials(body.body);
  if (!parsed.ok) return jsonError(parsed.issues, 400);

  const gateway = await getServerAuthGateway();
  const result = await gateway.signInWithPassword(parsed.value);
  if (!result.ok) return jsonError([result.message], 401);

  const next = safeNextPath(
    new URL(request.url).searchParams.get("redirectTo"),
  );
  return jsonOk({ next });
}
