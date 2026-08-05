import { createMemoryStorage } from "@/features/families/memoryStorage";
import {
  clearLessonRun,
  readProfileProgress,
  recordCompletion,
  resetProfileProgress,
  setMissionStatus,
  writeLessonRun,
} from "@/features/lessons/progressStorage";
import {
  completeOnboarding,
  createProfile,
  deleteProfile,
  readFamilyState,
  selectProfile,
  updateProfile,
} from "@/features/profiles/profileStorage";
import type { FamilyStore } from "./store";

/**
 * The in-memory family store: the offline stand-in for PostgreSQL.
 *
 * It is selected only when the database is not configured — local development
 * without a database, CI, the e2e suite, and a fresh clone — and env validation
 * forbids it in preview and production (`assertLocalPersistenceAllowed`), the
 * same guard the local auth stand-in carries (decision 033). Data lives for the
 * life of the server process and is gone on restart, which is exactly right for
 * a stand-in and exactly wrong for real progress; that is what the database is
 * for.
 *
 * It carries no persistence logic of its own. Each family gets its own
 * `Storage`, and the prototype stores' validated read/write functions run
 * against it — so the three-profile cap, nickname trimming, per-child scoping,
 * and tampered-data handling are the same code paths the browser used, and the
 * same ones their unit tests still cover.
 */
export function createMemoryFamilyStore(): FamilyStore {
  const familyIdByUser = new Map<string, string>();
  const storageByFamily = new Map<string, Storage>();

  function storageFor(familyId: string): Storage {
    let storage = storageByFamily.get(familyId);
    if (storage === undefined) {
      storage = createMemoryStorage();
      storageByFamily.set(familyId, storage);
    }
    return storage;
  }

  return {
    ensureFamily(userId) {
      let familyId = familyIdByUser.get(userId);
      if (familyId === undefined) {
        familyId = crypto.randomUUID();
        familyIdByUser.set(userId, familyId);
        storageByFamily.set(familyId, createMemoryStorage());
      }
      return Promise.resolve(familyId);
    },

    getFamily(familyId) {
      return Promise.resolve(readFamilyState(storageFor(familyId)));
    },

    profileExists(familyId, profileId) {
      const exists = readFamilyState(storageFor(familyId)).profiles.some(
        (profile) => profile.id === profileId,
      );
      return Promise.resolve(exists);
    },

    createProfile(familyId, draft) {
      return Promise.resolve(createProfile(draft, storageFor(familyId)));
    },

    updateProfile(familyId, profileId, draft) {
      return Promise.resolve(
        updateProfile(profileId, draft, storageFor(familyId)),
      );
    },

    deleteProfile(familyId, profileId) {
      const storage = storageFor(familyId);
      // The database cascades progress and missions away with the profile; the
      // stand-in clears them here so the two behave identically.
      resetProfileProgress(profileId, storage);
      return Promise.resolve(deleteProfile(profileId, storage));
    },

    selectProfile(familyId, profileId) {
      return Promise.resolve(selectProfile(profileId, storageFor(familyId)));
    },

    completeOnboarding(familyId) {
      return Promise.resolve(completeOnboarding(storageFor(familyId)));
    },

    getProgress(familyId, profileId) {
      return Promise.resolve(
        readProfileProgress(profileId, storageFor(familyId)),
      );
    },

    saveRun(familyId, profileId, lessonId, lessonVersion, state) {
      writeLessonRun(
        profileId,
        lessonId,
        lessonVersion,
        state,
        storageFor(familyId),
      );
      return Promise.resolve();
    },

    clearRun(familyId, profileId, lessonId) {
      clearLessonRun(profileId, lessonId, storageFor(familyId));
      return Promise.resolve();
    },

    recordCompletion(
      familyId,
      profileId,
      lessonId,
      lessonVersion,
      completedAt,
    ) {
      recordCompletion(
        profileId,
        lessonId,
        lessonVersion,
        completedAt,
        storageFor(familyId),
      );
      return Promise.resolve();
    },

    setMissionStatus(familyId, profileId, lessonId, status, _markedByUserId) {
      setMissionStatus(profileId, lessonId, status, storageFor(familyId));
      return Promise.resolve();
    },

    resetProgress(familyId, profileId) {
      resetProfileProgress(profileId, storageFor(familyId));
      return Promise.resolve();
    },
  };
}
