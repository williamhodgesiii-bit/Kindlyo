import { ageBands, type AgeBand } from "@/features/profiles/types";
import { maxEmailLength, type WaitlistSubmission } from "./types";

/**
 * Validation for the waitlist endpoint.
 *
 * Hand-rolled rather than reaching for a schema library, following
 * docs/DECISIONS.md record 012 and the shape already used by `parseEnv` in
 * `src/lib/env.ts` and `parseLesson` in `src/features/curriculum/validate.ts`:
 * pure predicates that collect readable issues instead of throwing.
 *
 * The same function runs in the browser and in the route handler. That is the
 * point — the two can never drift into disagreeing about what a valid address
 * is, and the client can give immediate feedback without a round trip.
 *
 * The address check is deliberately conservative rather than exhaustive. No
 * regular expression matches the full grammar, and a public endpoint is better
 * served by rejecting obvious nonsense than by pretending to be authoritative;
 * whether an address actually receives mail is only ever answered by sending
 * to it.
 */

export type WaitlistParseResult =
  { ok: true; value: WaitlistSubmission } | { ok: false; issues: string[] };

const allowedKeys: readonly string[] = ["email", "ageBand"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAgeBand(value: unknown): value is AgeBand {
  return typeof value === "string" && (ageBands as string[]).includes(value);
}

function isDomainLabel(label: string): boolean {
  return (
    label.length > 0 &&
    label.length <= 63 &&
    !label.startsWith("-") &&
    !label.endsWith("-") &&
    /^[a-z0-9-]+$/i.test(label)
  );
}

/** A conservative shape check: one `@`, a plausible local part, a real domain. */
export function isEmailShaped(value: string): boolean {
  if (/\s/.test(value)) return false;

  const parts = value.split("@");
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (local === undefined || domain === undefined) return false;
  if (local.length === 0 || local.length > 64) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) {
    return false;
  }
  if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+$/i.test(local)) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;
  if (!labels.every(isDomainLabel)) return false;

  const tld = labels[labels.length - 1];
  return tld !== undefined && /^[a-z]{2,}$/i.test(tld);
}

export function parseWaitlistSubmission(value: unknown): WaitlistParseResult {
  if (!isRecord(value)) {
    return { ok: false, issues: ["Expected an object with an email address."] };
  }

  const issues: string[] = [];

  const unknownKeys = Object.keys(value).filter(
    (key) => !allowedKeys.includes(key),
  );
  if (unknownKeys.length > 0) {
    issues.push(`Unexpected field: ${unknownKeys.join(", ")}.`);
  }

  const rawEmail = value.email;
  let email = "";
  if (typeof rawEmail !== "string") {
    issues.push("Please enter an email address.");
  } else {
    const trimmed = rawEmail.trim();
    if (trimmed === "") {
      issues.push("Please enter an email address.");
    } else if (trimmed.length > maxEmailLength) {
      issues.push(
        `That email address is too long (the limit is ${maxEmailLength} characters).`,
      );
    } else if (!isEmailShaped(trimmed)) {
      issues.push("That does not look like an email address.");
    } else {
      email = trimmed;
    }
  }

  const rawAgeBand = value.ageBand;
  let ageBand: AgeBand | undefined;
  if (rawAgeBand !== undefined && rawAgeBand !== null && rawAgeBand !== "") {
    if (isAgeBand(rawAgeBand)) {
      ageBand = rawAgeBand;
    } else {
      issues.push(`Age must be one of ${ageBands.join(" or ")}.`);
    }
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    value: ageBand === undefined ? { email } : { email, ageBand },
  };
}
