import {
  getBrowserStorage,
  lessonProgressStorageKey,
} from "@/features/lessons/progressStorage";
import { profileStorageKey } from "@/features/profiles/profileStorage";

/**
 * The one-time reset of the old browser-local prototype data.
 *
 * Profiles and progress used to live in this browser's local storage. They now
 * belong to the parent's account in the database (decision 034). The task asks
 * for a one-time local reset rather than a migration: the local data is not
 * moved server-side — it is simply cleared once, so a returning parent does not
 * carry a stale, device-only copy alongside their real account, and so a shared
 * device does not keep another child's old progress lying around.
 *
 * Guarded by a marker key so it runs exactly once per browser, and defensive
 * like the stores it replaces: if storage is blocked, there is nothing to clear
 * and nothing to do.
 */

export const legacyResetMarkerKey = "kindlyo.local-data-reset.v1";

const legacyKeys = [profileStorageKey, lessonProgressStorageKey] as const;

export function resetLegacyLocalData(
  storage: Storage | null = getBrowserStorage(),
): void {
  if (storage === null) return;
  try {
    if (storage.getItem(legacyResetMarkerKey) !== null) return;
    for (const key of legacyKeys) storage.removeItem(key);
    storage.setItem(legacyResetMarkerKey, new Date().toISOString());
  } catch {
    // Storage is blocked or full. There is then nothing device-local to clear,
    // so failing quietly is the whole of the correct behaviour.
  }
}
