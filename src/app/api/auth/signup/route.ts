import { rateLimitedError } from "@/features/auth/errors";
import {
  clientKey,
  jsonError,
  jsonOk,
  readJsonBody,
  safeNextPath,
} from "@/features/auth/http";
import { getServerAuthGateway } from "@/features/auth/session";
import { parseSignUpCredentials } from "@/features/auth/validate";
import { createFixedWindowLimiter } from "@/features/waitlist/rateLimit";

/**
 * Create a parent account.
 *
 * Whether a session is established immediately depends on the provider: the
 * local stand-in signs the new parent straight in, and a Supabase project with
 * email confirmation on will instead have sent a link. The response says which
 * happened (`confirmEmail`) so the form can either navigate on or ask the parent
 * to check their inbox. Errors stay generic — sign-up must not reveal that an
 * address is already registered.
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

  const parsed = parseSignUpCredentials(body.body);
  if (!parsed.ok) return jsonError(parsed.issues, 400);

  const gateway = await getServerAuthGateway();
  const result = await gateway.signUp(parsed.value);
  if (!result.ok) return jsonError([result.message], 400);

  // A session now means no email confirmation is required; send them onward.
  const user = await gateway.getUser();
  if (user !== null) {
    const next = safeNextPath(
      new URL(request.url).searchParams.get("redirectTo"),
    );
    return jsonOk({ next, confirmEmail: false });
  }

  return jsonOk({ confirmEmail: true });
}
