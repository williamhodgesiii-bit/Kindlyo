import { describe, expect, it } from "vitest";
import { lessonProgressStorageKey } from "@/features/lessons/progressStorage";
import { profileStorageKey } from "@/features/profiles/profileStorage";
import { createMemoryStorage } from "./memoryStorage";
import {
  legacyResetMarkerKey,
  resetLegacyLocalData,
} from "./resetLegacyLocalData";

describe("resetLegacyLocalData", () => {
  it("clears the legacy profile and progress keys, and marks it done", () => {
    const storage = createMemoryStorage();
    storage.setItem(profileStorageKey, "{}");
    storage.setItem(lessonProgressStorageKey, "{}");

    resetLegacyLocalData(storage);

    expect(storage.getItem(profileStorageKey)).toBeNull();
    expect(storage.getItem(lessonProgressStorageKey)).toBeNull();
    expect(storage.getItem(legacyResetMarkerKey)).not.toBeNull();
  });

  it("runs exactly once, leaving later data alone", () => {
    const storage = createMemoryStorage();
    resetLegacyLocalData(storage);

    // Anything written after the one-time reset is not the parent's problem to
    // lose: the reset must not fire again and wipe it.
    storage.setItem(profileStorageKey, "{}");
    resetLegacyLocalData(storage);

    expect(storage.getItem(profileStorageKey)).toBe("{}");
  });

  it("does nothing when storage is unavailable", () => {
    expect(() => resetLegacyLocalData(null)).not.toThrow();
  });
});
