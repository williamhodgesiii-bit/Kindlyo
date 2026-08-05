/**
 * Input validation for the authentication forms and endpoints.
 *
 * Same discipline as `parseWaitlistSubmission` and `parseEnv`: hand-rolled pure
 * predicates that collect readable issues, shared by the browser form and the
 * route handler so the two can never disagree about what a valid input is.
 *
 * These messages describe the *shape of the input* ("that does not look like an
 * email address") and are safe to be specific — they say nothing about whether
 * an account exists. Whether the credentials actually match is answered only by
 * the provider, and that answer is always generic (see `errors.ts`).
 *
 * `isEmailShaped` is reused from the waitlist rather than reimplemented, so
 * there is one conservative definition of a plausible address in the codebase.
 */

import { maxEmailLength } from "@/features/waitlist/types";
import { isEmailShaped } from "@/features/waitlist/validate";
import {
  type AuthCredentials,
  maxPasswordLength,
  minPasswordLength,
} from "./types";

export type EmailParseResult =
  { ok: true; value: string } | { ok: false; issues: string[] };

export type CredentialsParseResult =
  { ok: true; value: AuthCredentials } | { ok: false; issues: string[] };

export type PasswordParseResult =
  { ok: true; value: string } | { ok: false; issues: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Validates an email address to the waitlist's conservative shape. */
export function parseEmail(value: unknown): EmailParseResult {
  if (typeof value !== "string") {
    return { ok: false, issues: ["Please enter an email address."] };
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    return { ok: false, issues: ["Please enter an email address."] };
  }
  if (trimmed.length > maxEmailLength) {
    return {
      ok: false,
      issues: [
        `That email address is too long (the limit is ${maxEmailLength} characters).`,
      ],
    };
  }
  if (!isEmailShaped(trimmed)) {
    return { ok: false, issues: ["That does not look like an email address."] };
  }
  return { ok: true, value: trimmed };
}

/** Validates a *new* password (sign-up, reset): length bounds only. */
export function parseNewPassword(value: unknown): PasswordParseResult {
  if (typeof value !== "string") {
    return { ok: false, issues: ["Please choose a password."] };
  }
  if (value.length < minPasswordLength) {
    return {
      ok: false,
      issues: [
        `Please choose a password of at least ${minPasswordLength} characters.`,
      ],
    };
  }
  if (value.length > maxPasswordLength) {
    return {
      ok: false,
      issues: [
        `That password is too long (the limit is ${maxPasswordLength} characters).`,
      ],
    };
  }
  return { ok: true, value };
}

function collectEmailAndPassword(
  value: unknown,
  parsePassword: (password: unknown) => PasswordParseResult,
): CredentialsParseResult {
  if (!isRecord(value)) {
    return {
      ok: false,
      issues: ["Expected an email address and a password."],
    };
  }

  const issues: string[] = [];

  const email = parseEmail(value.email);
  if (!email.ok) issues.push(...email.issues);

  const password = parsePassword(value.password);
  if (!password.ok) issues.push(...password.issues);

  if (!email.ok || !password.ok) {
    return { ok: false, issues };
  }

  return { ok: true, value: { email: email.value, password: password.value } };
}

/**
 * Sign-in: the email must be shaped and the password merely present. A
 * length rule here would reject valid existing passwords and reveal nothing.
 */
export function parseSignInCredentials(value: unknown): CredentialsParseResult {
  return collectEmailAndPassword(value, (password) => {
    if (typeof password !== "string" || password === "") {
      return { ok: false, issues: ["Please enter your password."] };
    }
    return { ok: true, value: password };
  });
}

/** Sign-up: the email must be shaped and the new password must meet the length rule. */
export function parseSignUpCredentials(value: unknown): CredentialsParseResult {
  return collectEmailAndPassword(value, parseNewPassword);
}
