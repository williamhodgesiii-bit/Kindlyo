/**
 * Generic authentication error messages.
 *
 * A children's product must not help an attacker learn which email addresses
 * have accounts. So none of these messages distinguishes "no such account" from
 * "wrong password", and the reset flow says the same thing whether or not the
 * address is known. The one thing worth telling a parent apart from a generic
 * failure is that they are going too fast, because that is actionable and
 * reveals nothing.
 *
 * `toAuthErrorMessage` is the single place a raw provider error becomes
 * user-facing text, so the anti-enumeration rule lives in one testable function
 * rather than being re-derived at each call site.
 */

export const genericSignInError =
  "Those sign-in details did not match. Check your email and password and try again.";

export const genericSignUpError =
  "We could not create that account. Please check your details and try again.";

/**
 * Deliberately identical whether or not the address is known. Shown after every
 * reset request.
 */
export const genericResetSentMessage =
  "If that email address has an account, we've sent a link to reset the password. Please check your inbox.";

export const rateLimitedError =
  "That is a few tries in quick succession. Please wait a moment and try again.";

export const genericUnexpectedError =
  "Something went wrong on our end. Please try again.";

function readNumber(
  source: Record<string, unknown>,
  key: string,
): number | undefined {
  const value = source[key];
  return typeof value === "number" ? value : undefined;
}

function readString(
  source: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = source[key];
  return typeof value === "string" ? value : undefined;
}

/**
 * True when the provider error looks like a rate-limit rejection. Supabase
 * surfaces these as HTTP 429 and/or a `code`/`message` mentioning the limit.
 * Checked defensively because the exact shape is not part of a stable contract.
 */
export function isRateLimitError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const source = error as Record<string, unknown>;

  if (readNumber(source, "status") === 429) return true;

  const code = readString(source, "code")?.toLowerCase() ?? "";
  if (code.includes("rate") || code.includes("too_many")) return true;

  const message = readString(source, "message")?.toLowerCase() ?? "";
  return message.includes("rate limit") || message.includes("too many");
}

/**
 * Maps any provider error to a safe message: the rate-limit notice when it is
 * one, otherwise the caller's generic fallback for that context.
 */
export function toAuthErrorMessage(error: unknown, fallback: string): string {
  return isRateLimitError(error) ? rateLimitedError : fallback;
}
