import type { AgeBand } from "@/features/profiles/types";

/**
 * The founding-family waitlist, as data.
 *
 * One required field and one optional one. There is deliberately nowhere to put
 * a parent's name, a child's name, a child's age in years, or anything else:
 * docs/PRIVACY_AND_SAFETY.md asks for the minimum, and a type with nowhere to
 * put something collects it never — the same rule `ProfileDraft` follows.
 *
 * `ageBand` reuses the profile band rather than introducing a second age
 * vocabulary, and it stays optional because nobody should have to answer a
 * question about their child to hear about a beta.
 */

export type WaitlistSubmission = {
  email: string;
  ageBand?: AgeBand;
};

export type WaitlistEntry = WaitlistSubmission & {
  /** ISO timestamp, recorded by the server rather than sent by the browser. */
  receivedAt: string;
};

/** The RFC 5321 maximum for a forward path. */
export const maxEmailLength = 254;
