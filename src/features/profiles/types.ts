/**
 * Child profiles, as data.
 *
 * A profile is a nickname and an age band, full stop. No legal name, no birth
 * date, no photograph, no email — docs/PRIVACY_AND_SAFETY.md requires the
 * minimum, and the narrowest way to guarantee "minimum" is a type with nowhere
 * to put anything else.
 *
 * These are local demo profiles. Real profiles belong to a parent account in
 * the database and arrive with the persistence slice; the shape is kept
 * deliberately close to what that table will hold so the migration is a move,
 * not a redesign.
 */

/** Coarse on purpose: an age band is stored instead of a birthday. */
export type AgeBand = "5–6" | "7–9";

export const ageBands: readonly AgeBand[] = ["5–6", "7–9"];

export type ChildProfile = {
  id: string;
  nickname: string;
  ageBand: AgeBand;
  /** ISO timestamp. */
  createdAt: string;
};

/** Journey 2: a parent may create up to three child profiles. */
export const maxProfiles = 3;

/** Keeps nicknames short enough for cards and avatars everywhere. */
export const maxNicknameLength = 24;
