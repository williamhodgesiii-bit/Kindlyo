import {
  ageBands,
  maxNicknameLength,
  maxProfiles,
  type AgeBand,
  type ChildProfile,
} from "./types";

/**
 * Local demo child profiles.
 *
 * Same posture as the lesson progress store: local storage is scaffolding for
 * the pre-database phase, it can be absent, disabled, full, or tampered with,
 * and none of those may break a page. Anything unreadable is treated as "no
 * profiles yet".
 *
 * The rules that matter — at most three profiles, nicknames trimmed and
 * bounded, age bands from the fixed list — are enforced here, in one place,
 * rather than trusted to every form that writes.
 *
 * All functions take an injectable `Storage` so tests never depend on a real
 * browser.
 */

const STORAGE_KEY = "kindlyo.demo.profiles.v1";

export type FamilyState = {
  profiles: ChildProfile[];
  /** Which child is learning right now. Null between sessions of different kids. */
  selectedProfileId: string | null;
};

export const emptyFamilyState: FamilyState = {
  profiles: [],
  selectedProfileId: null,
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
  const { id, nickname, ageBand, createdAt } = value;

  if (typeof id !== "string" || id.trim() === "") return null;
  if (typeof nickname !== "string" || nickname.trim() === "") return null;
  if (!isAgeBand(ageBand)) return null;
  if (typeof createdAt !== "string") return null;

  return {
    id,
    nickname: nickname.trim().slice(0, maxNicknameLength),
    ageBand,
    createdAt,
  };
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

    return { profiles, selectedProfileId };
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

export type CreateProfileResult =
  | { ok: true; state: FamilyState; profile: ChildProfile }
  | { ok: false; reason: "limit" | "empty-nickname" };

export function createProfile(
  nickname: string,
  ageBand: AgeBand,
  storage: Storage | null = getBrowserStorage(),
): CreateProfileResult {
  const state = readFamilyState(storage);

  const trimmed = nickname.trim().slice(0, maxNicknameLength);
  if (trimmed === "") return { ok: false, reason: "empty-nickname" };
  if (state.profiles.length >= maxProfiles) {
    return { ok: false, reason: "limit" };
  }

  const profile: ChildProfile = {
    id: crypto.randomUUID(),
    nickname: trimmed,
    ageBand,
    createdAt: new Date().toISOString(),
  };

  const next = writeFamilyState(
    { ...state, profiles: [...state.profiles, profile] },
    storage,
  );
  return { ok: true, state: next, profile };
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
 * profile's lesson progress (`deleteProfileProgress`) — kept separate so the
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
    },
    storage,
  );
}

export const profileStorageKey = STORAGE_KEY;
