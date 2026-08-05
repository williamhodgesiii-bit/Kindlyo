import type { LessonProgress } from "@/features/lessons/lessonMachine";
import {
  clearLessonRun as clearLocalRun,
  readProfileProgress,
  recordCompletion as recordLocalCompletion,
  resetProfileProgress,
  setMissionStatus as setLocalMissionStatus,
  writeLessonRun as writeLocalRun,
  type MissionStatus,
  type ProfileProgress,
} from "@/features/lessons/progressStorage";
import {
  completeOnboarding as completeLocalOnboarding,
  createProfile as createLocalProfile,
  deleteProfile as deleteLocalProfile,
  emptyFamilyState,
  readFamilyState,
  selectProfile as selectLocalProfile,
  updateProfile as updateLocalProfile,
  type FamilyState,
  type ProfileWriteResult,
} from "@/features/profiles/profileStorage";
import type { ChildProfile, ProfileDraft } from "@/features/profiles/types";

/**
 * The browser's door to a family's data.
 *
 * Before this slice, profiles and progress lived in one browser's local
 * storage and every hook read and wrote it directly and synchronously. They
 * now belong to a parent account in PostgreSQL, reached only from the server
 * and scoped there to the signed-in parent (never to an id the browser sent).
 * So the hooks talk to this async interface instead, and the shape of the data
 * they get back is unchanged — the migration is a move, not a redesign.
 *
 * Two implementations satisfy it, the same seam as the auth gateway
 * (decision 033):
 *
 * - `httpFamilyClient` — the real one the app uses, calling the route handlers
 *   under `/api/family` and `/api/progress`, which do the authorization.
 * - `createLocalFamilyClient` — an in-process stand-in over an injectable
 *   `Storage`, reusing the prototype stores' own validation. It backs the unit
 *   tests (seedable, no network), the same role the local auth session plays.
 */
export interface FamilyClient {
  loadFamily(): Promise<FamilyState>;
  createProfile(draft: ProfileDraft): Promise<ProfileWriteResult>;
  updateProfile(
    profileId: string,
    draft: Partial<ProfileDraft>,
  ): Promise<ProfileWriteResult>;
  selectProfile(profileId: string | null): Promise<FamilyState>;
  /** Removes the profile AND, by cascade, all of its progress. */
  deleteProfile(profileId: string): Promise<FamilyState>;
  completeOnboarding(): Promise<FamilyState>;

  loadProgress(profileId: string): Promise<ProfileProgress>;
  saveRun(
    profileId: string,
    lessonId: string,
    lessonVersion: number,
    state: LessonProgress,
  ): Promise<void>;
  clearRun(profileId: string, lessonId: string): Promise<void>;
  recordCompletion(
    profileId: string,
    lessonId: string,
    lessonVersion: number,
    completedAt: string,
  ): Promise<void>;
  setMissionStatus(
    profileId: string,
    lessonId: string,
    status: MissionStatus | null,
  ): Promise<void>;
  /** Clears one profile's progress, keeping the profile. */
  resetProgress(profileId: string): Promise<void>;
}

// --- The in-process stand-in -------------------------------------------------

/**
 * A client backed by an injectable `Storage`, delegating to the prototype
 * stores so every rule they enforce (the three-profile cap, nickname trimming,
 * tampered-data handling) holds here too. Deleting a profile cascades to its
 * progress, matching the database's `ON DELETE CASCADE` and the product rule
 * that a deleted child leaves no orphaned progress behind.
 */
export function createLocalFamilyClient(
  getStorage: () => Storage,
): FamilyClient {
  return {
    loadFamily() {
      return Promise.resolve(readFamilyState(getStorage()));
    },
    createProfile(draft) {
      return Promise.resolve(createLocalProfile(draft, getStorage()));
    },
    updateProfile(profileId, draft) {
      return Promise.resolve(
        updateLocalProfile(profileId, draft, getStorage()),
      );
    },
    selectProfile(profileId) {
      return Promise.resolve(selectLocalProfile(profileId, getStorage()));
    },
    deleteProfile(profileId) {
      const storage = getStorage();
      // Progress goes with the profile: the database cascades, and the
      // stand-in must not leave an orphan the prototype promised to never
      // resurrect.
      resetProfileProgress(profileId, storage);
      return Promise.resolve(deleteLocalProfile(profileId, storage));
    },
    completeOnboarding() {
      return Promise.resolve(completeLocalOnboarding(getStorage()));
    },
    loadProgress(profileId) {
      return Promise.resolve(readProfileProgress(profileId, getStorage()));
    },
    saveRun(profileId, lessonId, lessonVersion, state) {
      writeLocalRun(profileId, lessonId, lessonVersion, state, getStorage());
      return Promise.resolve();
    },
    clearRun(profileId, lessonId) {
      clearLocalRun(profileId, lessonId, getStorage());
      return Promise.resolve();
    },
    recordCompletion(profileId, lessonId, lessonVersion, completedAt) {
      recordLocalCompletion(
        profileId,
        lessonId,
        lessonVersion,
        completedAt,
        getStorage(),
      );
      return Promise.resolve();
    },
    setMissionStatus(profileId, lessonId, status) {
      setLocalMissionStatus(profileId, lessonId, status, getStorage());
      return Promise.resolve();
    },
    resetProgress(profileId) {
      resetProfileProgress(profileId, getStorage());
      return Promise.resolve();
    },
  };
}

// --- The real, server-backed client -----------------------------------------

async function readJson(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Parses a `FamilyState` from an API response defensively. The wire is
 * untrusted input like any other (CLAUDE.md), so a malformed body resolves to
 * "no family yet" rather than throwing into a render.
 */
function parseFamilyState(value: unknown): FamilyState {
  if (!isRecord(value)) return emptyFamilyState;
  // The server has already validated shape and scoping; this only guards the
  // top-level types the caller relies on. Profiles keep their server shape.
  const profiles: ChildProfile[] = Array.isArray(value.profiles)
    ? (value.profiles as ChildProfile[])
    : [];
  return {
    profiles,
    selectedProfileId:
      typeof value.selectedProfileId === "string"
        ? value.selectedProfileId
        : null,
    onboardedAt:
      typeof value.onboardedAt === "string" ? value.onboardedAt : null,
  };
}

function parseWriteResult(status: number, body: unknown): ProfileWriteResult {
  if (isRecord(body) && body.ok === true) {
    return {
      ok: true,
      state: parseFamilyState(body.state),
      profile: body.profile as ChildProfile,
    };
  }
  const reason =
    isRecord(body) && typeof body.reason === "string" ? body.reason : "";
  if (
    reason === "limit" ||
    reason === "empty-nickname" ||
    reason === "not-found"
  ) {
    return { ok: false, reason };
  }
  // An unexpected failure is surfaced as the closest safe reason so the form
  // shows a message rather than throwing. A nickname problem is the common
  // 4xx; anything else is treated as a generic save failure.
  return { ok: false, reason: status === 404 ? "not-found" : "empty-nickname" };
}

const jsonHeaders = { "content-type": "application/json" } as const;

export function createHttpFamilyClient(): FamilyClient {
  async function post(path: string, body?: unknown): Promise<Response> {
    return fetch(path, {
      method: "POST",
      headers: jsonHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  return {
    async loadFamily() {
      const response = await fetch("/api/family", { cache: "no-store" });
      return parseFamilyState(await readJson(response));
    },
    async createProfile(draft) {
      const response = await post("/api/family/profiles", draft);
      return parseWriteResult(response.status, await readJson(response));
    },
    async updateProfile(profileId, draft) {
      const response = await fetch(
        `/api/family/profiles/${encodeURIComponent(profileId)}`,
        { method: "PATCH", headers: jsonHeaders, body: JSON.stringify(draft) },
      );
      return parseWriteResult(response.status, await readJson(response));
    },
    async selectProfile(profileId) {
      const response = await fetch("/api/family/selection", {
        method: "PUT",
        headers: jsonHeaders,
        body: JSON.stringify({ profileId }),
      });
      const body = await readJson(response);
      return parseFamilyState(isRecord(body) ? body.state : null);
    },
    async deleteProfile(profileId) {
      const response = await fetch(
        `/api/family/profiles/${encodeURIComponent(profileId)}`,
        { method: "DELETE" },
      );
      const body = await readJson(response);
      return parseFamilyState(isRecord(body) ? body.state : null);
    },
    async completeOnboarding() {
      const response = await post("/api/family/onboarding");
      const body = await readJson(response);
      return parseFamilyState(isRecord(body) ? body.state : null);
    },
    async loadProgress(profileId) {
      const response = await fetch(
        `/api/progress/${encodeURIComponent(profileId)}`,
        { cache: "no-store" },
      );
      const body = await readJson(response);
      return isRecord(body) ? (body as ProfileProgress) : {};
    },
    async saveRun(profileId, lessonId, lessonVersion, state) {
      await fetch(`/api/progress/${encodeURIComponent(profileId)}/run`, {
        method: "PUT",
        headers: jsonHeaders,
        body: JSON.stringify({ lessonId, lessonVersion, state }),
      });
    },
    async clearRun(profileId, lessonId) {
      await fetch(
        `/api/progress/${encodeURIComponent(profileId)}/run?lessonId=${encodeURIComponent(lessonId)}`,
        { method: "DELETE" },
      );
    },
    async recordCompletion(profileId, lessonId, lessonVersion, completedAt) {
      await post(`/api/progress/${encodeURIComponent(profileId)}/completion`, {
        lessonId,
        lessonVersion,
        completedAt,
      });
    },
    async setMissionStatus(profileId, lessonId, status) {
      await fetch(`/api/progress/${encodeURIComponent(profileId)}/mission`, {
        method: "PUT",
        headers: jsonHeaders,
        body: JSON.stringify({ lessonId, status }),
      });
    },
    async resetProgress(profileId) {
      await fetch(`/api/progress/${encodeURIComponent(profileId)}`, {
        method: "DELETE",
      });
    },
  };
}

let cached: FamilyClient | null = null;

/** The app's family client. The real one; tests mock this module. */
export function getFamilyClient(): FamilyClient {
  cached ??= createHttpFamilyClient();
  return cached;
}
