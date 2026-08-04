import {
  ageBands,
  isAvatarId,
  maxNicknameLength,
  maxProfiles,
  type AgeBand,
  type ChildProfile,
  type ProfileDraft,
} from "./types";

/**
 * Local prototype storage for child profiles.
 *
 * PROTOTYPE ONLY, and labelled as such on screen. There is no account and no
 * database yet: profiles live in this browser, on this device, visible to
 * anyone using it, and gone when storage is cleared. The persistence slice
 * replaces this wholesale.
 *
 * Same posture as the lesson progress store: storage can be absent, disabled,
 * full, or tampered with, and none of those may break a page. Anything
 * unreadable is treated as "no profiles yet".
 *
 * The rules that matter — at most three profiles, nicknames trimmed and
 * bounded, age bands and avatars from fixed lists — are enforced here, in one
 * place, rather than trusted to every form that writes.
 *
 * All functions take an injectable `Storage` so tests never depend on a real
 * browser.
 */

const STORAGE_KEY = "kindlyo.prototype.profiles.v1";

export type FamilyState = {
  profiles: ChildProfile[];
  /** Which child is learning right now. Null between sessions of different kids. */
  selectedProfileId: string | null;
  /** ISO timestamp; null until the parent finishes onboarding. */
  onboardedAt: string | null;
};

export const emptyFamilyState: FamilyState = {
  profiles: [],
  selectedProfileId: null,
  onboardedAt: null,
};

export function getBrowserStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAgeBand(value: unknown): value is AgeBand {
  return typeof value === "string" && (ageBands as string[]).includes(value);
}

/** A stored profile is kept only if every field is what it claims to be. */
function parseProfile(value: unknown): ChildProfile | null {
  if (!isRecord(value)) return null;
  const { id, nickname, ageBand, avatarId, createdAt } = value;

  if (typeof id !== "string" || id.trim() === "") return null;
  if (typeof nickname !== "string" || nickname.trim() === "") return null;
  if (!isAgeBand(ageBand)) return null;
  if (typeof createdAt !== "string") return null;

  const profile: ChildProfile = {
    id,
    nickname: nickname.trim().slice(0, maxNicknameLength),
    ageBand,
    createdAt,
  };
  // An unrecognised avatar is dropped rather than rejecting the whole profile:
  // losing a picture is a smaller harm than losing the child's progress.
  if (isAvatarId(avatarId)) profile.avatarId = avatarId;

  return profile;
}

export function readFamilyState(
  storage: Storage | null = getBrowserStorage(),
): FamilyState {
  if (storage === null) return emptyFamilyState;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return emptyFamilyState;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return emptyFamilyState;

    const profiles = (Array.isArray(parsed.profiles) ? parsed.profiles : [])
      .map(parseProfile)
      .filter((profile): profile is ChildProfile => profile !== null)
      // The cap holds even against hand-edited storage.
      .slice(0, maxProfiles);

    // A dangling selection (deleted profile, tampered id) resolves to "nobody
    // selected" rather than to an error or, worse, to somebody else.
    const selectedProfileId =
      typeof parsed.selectedProfileId === "string" &&
      profiles.some((profile) => profile.id === parsed.selectedProfileId)
        ? parsed.selectedProfileId
        : null;

    const onboardedAt =
      typeof parsed.onboardedAt === "string" ? parsed.onboardedAt : null;

    return { profiles, selectedProfileId, onboardedAt };
  } catch {
    return emptyFamilyState;
  }
}

function writeFamilyState(
  state: FamilyState,
  storage: Storage | null,
): FamilyState {
  if (storage !== null) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage refused the write. The in-memory state is still returned, so
      // the session keeps working; it just will not survive a reload.
    }
  }
  return state;
}

/** Trimmed and bounded, or null when there is nothing usable. */
function cleanNickname(nickname: string): string | null {
  const trimmed = nickname.trim().slice(0, maxNicknameLength);
  return trimmed === "" ? null : trimmed;
}

export type ProfileWriteResult =
  | { ok: true; state: FamilyState; profile: ChildProfile }
  | { ok: false; reason: "limit" | "empty-nickname" | "not-found" };

export function createProfile(
  draft: ProfileDraft,
  storage: Storage | null = getBrowserStorage(),
): ProfileWriteResult {
  const state = readFamilyState(storage);

  const nickname = cleanNickname(draft.nickname);
  if (nickname === null) return { ok: false, reason: "empty-nickname" };
  if (state.profiles.length >= maxProfiles)
    return { ok: false, reason: "limit" };

  const profile: ChildProfile = {
    id: crypto.randomUUID(),
    nickname,
    ageBand: draft.ageBand,
    createdAt: new Date().toISOString(),
  };
  if (draft.avatarId != null) profile.avatarId = draft.avatarId;

  const next = writeFamilyState(
    { ...state, profiles: [...state.profiles, profile] },
    storage,
  );
  return { ok: true, state: next, profile };
}

/**
 * Applies an edit. Only the fields present in the draft change, and passing
 * `avatarId: null` clears the avatar — the difference between "leave it" and
 * "remove it" that a plain optional field cannot express.
 */
export function updateProfile(
  profileId: string,
  draft: Partial<ProfileDraft>,
  storage: Storage | null = getBrowserStorage(),
): ProfileWriteResult {
  const state = readFamilyState(storage);
  const existing = state.profiles.find((profile) => profile.id === profileId);
  if (existing === undefined) return { ok: false, reason: "not-found" };

  let nickname = existing.nickname;
  if (draft.nickname !== undefined) {
    const cleaned = cleanNickname(draft.nickname);
    if (cleaned === null) return { ok: false, reason: "empty-nickname" };
    nickname = cleaned;
  }

  const updated: ChildProfile = {
    id: existing.id,
    nickname,
    ageBand: draft.ageBand ?? existing.ageBand,
    createdAt: existing.createdAt,
  };

  const avatarId =
    draft.avatarId === undefined
      ? existing.avatarId
      : (draft.avatarId ?? undefined);
  if (avatarId !== undefined) updated.avatarId = avatarId;

  const next = writeFamilyState(
    {
      ...state,
      profiles: state.profiles.map((profile) =>
        profile.id === profileId ? updated : profile,
      ),
    },
    storage,
  );
  return { ok: true, state: next, profile: updated };
}

export function selectProfile(
  profileId: string | null,
  storage: Storage | null = getBrowserStorage(),
): FamilyState {
  const state = readFamilyState(storage);
  const selectedProfileId =
    profileId !== null &&
    state.profiles.some((profile) => profile.id === profileId)
      ? profileId
      : null;

  return writeFamilyState({ ...state, selectedProfileId }, storage);
}

/**
 * Removes the profile. The caller is responsible for also deleting the
 * profile's lesson progress (`resetProfileProgress`) — kept separate so the
 * two stores stay independently testable.
 */
export function deleteProfile(
  profileId: string,
  storage: Storage | null = getBrowserStorage(),
): FamilyState {
  const state = readFamilyState(storage);
  const profiles = state.profiles.filter((profile) => profile.id !== profileId);

  return writeFamilyState(
    {
      profiles,
      selectedProfileId:
        state.selectedProfileId === profileId ? null : state.selectedProfileId,
      onboardedAt: state.onboardedAt,
    },
    storage,
  );
}

/** Records that the parent has been through onboarding, so it stops asking. */
export function completeOnboarding(
  storage: Storage | null = getBrowserStorage(),
  now: string = new Date().toISOString(),
): FamilyState {
  const state = readFamilyState(storage);
  if (state.onboardedAt !== null) return state;

  return writeFamilyState({ ...state, onboardedAt: now }, storage);
}

export const profileStorageKey = STORAGE_KEY;
