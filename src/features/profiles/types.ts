/**
 * Child profiles, as data.
 *
 * A profile is a nickname, an age band, and optionally one of a fixed set of
 * drawn avatars. No legal name, no birth date, no photograph, no email —
 * docs/PRIVACY_AND_SAFETY.md requires the minimum, and the narrowest way to
 * guarantee "minimum" is a type with nowhere to put anything else. Note in
 * particular that `avatarId` is a member of a closed union, not a URL or a
 * data blob: an uploaded photograph of a child cannot be represented here.
 *
 * These are local prototype profiles. Real profiles belong to a parent account
 * in the database and arrive with the persistence slice; the shape is kept
 * deliberately close to what that table will hold so the migration is a move,
 * not a redesign.
 */

/** Coarse on purpose: an age band is stored instead of a birthday. */
export type AgeBand = "5–6" | "7–9";

export const ageBands: readonly AgeBand[] = ["5–6", "7–9"];

/**
 * The avatar options, as ids. Drawn locally from simple shapes — see
 * `src/components/ui/avatarArt.tsx`. Optional: a profile with no avatar falls
 * back to its initial, which is what most children pick anyway.
 */
export type AvatarId = "fox" | "star" | "leaf" | "moon" | "boat" | "bird";

export const avatarIds: readonly AvatarId[] = [
  "fox",
  "star",
  "leaf",
  "moon",
  "boat",
  "bird",
];

/** Said aloud by a screen reader, and shown under each option in the picker. */
export const avatarLabels = {
  fox: "Fox",
  star: "Star",
  leaf: "Leaf",
  moon: "Moon",
  boat: "Boat",
  bird: "Bird",
} satisfies Record<AvatarId, string>;

export type ChildProfile = {
  id: string;
  nickname: string;
  ageBand: AgeBand;
  /** Absent when the child has not picked one. */
  avatarId?: AvatarId;
  /** ISO timestamp. */
  createdAt: string;
};

/** What a create or edit form produces. */
export type ProfileDraft = {
  nickname: string;
  ageBand: AgeBand;
  avatarId?: AvatarId | null;
};

/** Journey 2: a parent may create up to three child profiles. */
export const maxProfiles = 3;

/** Keeps nicknames short enough for cards and avatars everywhere. */
export const maxNicknameLength = 24;

export function isAvatarId(value: unknown): value is AvatarId {
  return typeof value === "string" && (avatarIds as string[]).includes(value);
}
