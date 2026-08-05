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

/**
 * The persistence port for a family's data.
 *
 * Every method is already scoped to a `familyId` that the caller — always
 * `FamilyService` — resolved from the authenticated parent. The store never
 * sees a raw user, and nothing above it may hand it a `familyId` that came from
 * a browser. This is the seam decision 033 established for auth: one interface,
 * a real PostgreSQL adapter (`postgresStore`) and an in-memory stand-in
 * (`memoryStore`), chosen by configuration in `getFamilyStore`.
 *
 * The types are the prototype stores' own types, unchanged, so the surface the
 * app sees is identical to what local storage gave it.
 */
export interface FamilyStore {
  /**
   * The parent's family id, provisioned on first use. This is the only place a
   * user id is mapped to a family; every other method takes the resolved id.
   */
  ensureFamily(userId: string): Promise<string>;

  getFamily(familyId: string): Promise<FamilyState>;
  /** Whether a profile id belongs to this family — the ownership check. */
  profileExists(familyId: string, profileId: string): Promise<boolean>;

  createProfile(
    familyId: string,
    draft: ProfileDraft,
  ): Promise<ProfileWriteResult>;
  updateProfile(
    familyId: string,
    profileId: string,
    draft: Partial<ProfileDraft>,
  ): Promise<ProfileWriteResult>;
  /** Removes the profile; its progress and missions cascade away with it. */
  deleteProfile(familyId: string, profileId: string): Promise<FamilyState>;
  selectProfile(
    familyId: string,
    profileId: string | null,
  ): Promise<FamilyState>;
  completeOnboarding(familyId: string): Promise<FamilyState>;

  getProgress(familyId: string, profileId: string): Promise<ProfileProgress>;
  saveRun(
    familyId: string,
    profileId: string,
    lessonId: string,
    lessonVersion: number,
    state: LessonProgress,
  ): Promise<void>;
  clearRun(
    familyId: string,
    profileId: string,
    lessonId: string,
  ): Promise<void>;
  recordCompletion(
    familyId: string,
    profileId: string,
    lessonId: string,
    lessonVersion: number,
    completedAt: string,
  ): Promise<void>;
  setMissionStatus(
    familyId: string,
    profileId: string,
    lessonId: string,
    status: MissionStatus | null,
    markedByUserId: string,
  ): Promise<void>;
  resetProgress(familyId: string, profileId: string): Promise<void>;
}
