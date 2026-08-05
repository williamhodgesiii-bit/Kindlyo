import type { LessonProgress } from "@/features/lessons/lessonMachine";
import type {
  MissionStatus,
  ProfileProgress,
} from "@/features/lessons/progressStorage";
import type {
  FamilyState,
  ProfileWriteResult,
} from "@/features/profiles/profileStorage";
import type { ProfileDraft } from "@/features/profiles/types";
import type { AuthUser } from "@/features/auth/types";
import { getFamilyStore } from "./index";
import type { FamilyStore } from "./store";

/**
 * The authorization boundary for family data.
 *
 * This is the only thing the route handlers call, and it is where the rule from
 * `docs/ARCHITECTURE.md` — "every protected query must verify family
 * membership; never trust a family or child identifier supplied by the browser"
 * — is actually enforced.
 *
 * Every method takes the authenticated parent and nothing that stands in for
 * one. The parent's family is resolved from their user id alone (and created on
 * first use); a `familyId` is never accepted from a caller. Any child profile
 * id that did come from the browser is checked against that family before it is
 * used, and a profile in another family is indistinguishable from one that does
 * not exist — the answer is `not-found`, which leaks nothing. The cross-family
 * denial this guarantees is proved in `service.test.ts`.
 */

/** A profile the parent's family does not own — reported without confirming it exists. */
export type NotFound = { ok: false; error: "not-found" };

export type FamilyService = {
  getFamily(user: AuthUser): Promise<FamilyState>;
  completeOnboarding(user: AuthUser): Promise<FamilyState>;
  createProfile(
    user: AuthUser,
    draft: ProfileDraft,
  ): Promise<ProfileWriteResult>;
  updateProfile(
    user: AuthUser,
    profileId: string,
    draft: Partial<ProfileDraft>,
  ): Promise<ProfileWriteResult>;
  deleteProfile(
    user: AuthUser,
    profileId: string,
  ): Promise<{ ok: true; state: FamilyState } | NotFound>;
  selectProfile(
    user: AuthUser,
    profileId: string | null,
  ): Promise<{ ok: true; state: FamilyState } | NotFound>;

  getProgress(
    user: AuthUser,
    profileId: string,
  ): Promise<{ ok: true; progress: ProfileProgress } | NotFound>;
  saveRun(
    user: AuthUser,
    profileId: string,
    lessonId: string,
    lessonVersion: number,
    state: LessonProgress,
  ): Promise<{ ok: true } | NotFound>;
  clearRun(
    user: AuthUser,
    profileId: string,
    lessonId: string,
  ): Promise<{ ok: true } | NotFound>;
  recordCompletion(
    user: AuthUser,
    profileId: string,
    lessonId: string,
    lessonVersion: number,
    completedAt: string,
  ): Promise<{ ok: true } | NotFound>;
  setMissionStatus(
    user: AuthUser,
    profileId: string,
    lessonId: string,
    status: MissionStatus | null,
  ): Promise<{ ok: true } | NotFound>;
  resetProgress(
    user: AuthUser,
    profileId: string,
  ): Promise<{ ok: true } | NotFound>;
};

const notFound: NotFound = { ok: false, error: "not-found" };

export function createFamilyService(store: FamilyStore): FamilyService {
  /**
   * Resolves the family, then runs `action` only if the profile belongs to it.
   * A profile in another family — or no family at all — falls through to
   * `not-found`, which is the whole of the cross-family guard.
   */
  async function withOwnedProfile<T>(
    user: AuthUser,
    profileId: string,
    action: (familyId: string) => Promise<T>,
  ): Promise<{ ok: true; value: T } | NotFound> {
    const familyId = await store.ensureFamily(user.id);
    if (!(await store.profileExists(familyId, profileId))) return notFound;
    return { ok: true, value: await action(familyId) };
  }

  return {
    async getFamily(user) {
      return store.getFamily(await store.ensureFamily(user.id));
    },

    async completeOnboarding(user) {
      return store.completeOnboarding(await store.ensureFamily(user.id));
    },

    async createProfile(user, draft) {
      return store.createProfile(await store.ensureFamily(user.id), draft);
    },

    async updateProfile(user, profileId, draft) {
      const familyId = await store.ensureFamily(user.id);
      // Scoped to this family, so another family's id is simply absent here and
      // the store already answers "not-found" — but check first so the denial
      // never depends on a downstream store's behaviour.
      if (!(await store.profileExists(familyId, profileId))) {
        return { ok: false, reason: "not-found" };
      }
      return store.updateProfile(familyId, profileId, draft);
    },

    async deleteProfile(user, profileId) {
      const result = await withOwnedProfile(user, profileId, (familyId) =>
        store.deleteProfile(familyId, profileId),
      );
      return result.ok ? { ok: true, state: result.value } : result;
    },

    async selectProfile(user, profileId) {
      const familyId = await store.ensureFamily(user.id);
      // Deselecting (null) is always allowed; selecting requires ownership so a
      // parent cannot point their session at another family's child.
      if (
        profileId !== null &&
        !(await store.profileExists(familyId, profileId))
      ) {
        return notFound;
      }
      return {
        ok: true,
        state: await store.selectProfile(familyId, profileId),
      };
    },

    async getProgress(user, profileId) {
      const result = await withOwnedProfile(user, profileId, (familyId) =>
        store.getProgress(familyId, profileId),
      );
      return result.ok ? { ok: true, progress: result.value } : result;
    },

    async saveRun(user, profileId, lessonId, lessonVersion, state) {
      const result = await withOwnedProfile(user, profileId, (familyId) =>
        store.saveRun(familyId, profileId, lessonId, lessonVersion, state),
      );
      return result.ok ? { ok: true } : result;
    },

    async clearRun(user, profileId, lessonId) {
      const result = await withOwnedProfile(user, profileId, (familyId) =>
        store.clearRun(familyId, profileId, lessonId),
      );
      return result.ok ? { ok: true } : result;
    },

    async recordCompletion(
      user,
      profileId,
      lessonId,
      lessonVersion,
      completedAt,
    ) {
      const result = await withOwnedProfile(user, profileId, (familyId) =>
        store.recordCompletion(
          familyId,
          profileId,
          lessonId,
          lessonVersion,
          completedAt,
        ),
      );
      return result.ok ? { ok: true } : result;
    },

    async setMissionStatus(user, profileId, lessonId, status) {
      const result = await withOwnedProfile(user, profileId, (familyId) =>
        store.setMissionStatus(familyId, profileId, lessonId, status, user.id),
      );
      return result.ok ? { ok: true } : result;
    },

    async resetProgress(user, profileId) {
      const result = await withOwnedProfile(user, profileId, (familyId) =>
        store.resetProgress(familyId, profileId),
      );
      return result.ok ? { ok: true } : result;
    },
  };
}

let cached: FamilyService | null = null;

/** The app's family service, over whichever store configuration selected. */
export function getFamilyService(): FamilyService {
  cached ??= createFamilyService(getFamilyStore());
  return cached;
}
