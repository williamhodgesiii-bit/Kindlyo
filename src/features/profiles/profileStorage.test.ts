import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createProfile,
  deleteProfile,
  profileStorageKey,
  readFamilyState,
  selectProfile,
} from "./profileStorage";
import { maxProfiles } from "./types";

/** A minimal in-memory Storage, so tests never depend on a real browser. */
function createStorage(initial: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => void map.delete(key),
    setItem: (key: string, value: string) => void map.set(key, value),
  };
}

let storage: Storage;

beforeEach(() => {
  storage = createStorage();
});

describe("creating profiles", () => {
  it("stores a nickname and an age band, and nothing else", () => {
    const result = createProfile("Ada", "5–6", storage);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Object.keys(result.profile).sort()).toEqual([
      "ageBand",
      "createdAt",
      "id",
      "nickname",
    ]);
  });

  it("round-trips through storage", () => {
    createProfile("Ada", "5–6", storage);

    const state = readFamilyState(storage);
    expect(state.profiles).toHaveLength(1);
    expect(state.profiles[0]?.nickname).toBe("Ada");
    expect(state.profiles[0]?.ageBand).toBe("5–6");
  });

  it("gives every profile its own id", () => {
    const first = createProfile("Ada", "5–6", storage);
    const second = createProfile("Ben", "7–9", storage);

    expect(
      first.ok && second.ok && first.profile.id !== second.profile.id,
    ).toBe(true);
  });

  it("trims the nickname", () => {
    createProfile("  Ada  ", "5–6", storage);

    expect(readFamilyState(storage).profiles[0]?.nickname).toBe("Ada");
  });

  it("refuses a nickname that is only whitespace", () => {
    const result = createProfile("   ", "5–6", storage);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("empty-nickname");
    expect(readFamilyState(storage).profiles).toHaveLength(0);
  });

  it("stops at three profiles", () => {
    createProfile("Ada", "5–6", storage);
    createProfile("Ben", "5–6", storage);
    createProfile("Cal", "7–9", storage);

    const fourth = createProfile("Dee", "7–9", storage);

    expect(fourth.ok).toBe(false);
    if (fourth.ok) return;
    expect(fourth.reason).toBe("limit");
    expect(readFamilyState(storage).profiles).toHaveLength(maxProfiles);
  });
});

describe("selecting a profile", () => {
  it("remembers who is learning", () => {
    const created = createProfile("Ada", "5–6", storage);
    if (!created.ok) throw new Error("setup failed");

    const state = selectProfile(created.profile.id, storage);

    expect(state.selectedProfileId).toBe(created.profile.id);
    expect(readFamilyState(storage).selectedProfileId).toBe(created.profile.id);
  });

  it("clears the selection when given null", () => {
    const created = createProfile("Ada", "5–6", storage);
    if (!created.ok) throw new Error("setup failed");
    selectProfile(created.profile.id, storage);

    expect(selectProfile(null, storage).selectedProfileId).toBeNull();
  });

  it("refuses to select a profile that does not exist", () => {
    createProfile("Ada", "5–6", storage);

    expect(selectProfile("someone-else", storage).selectedProfileId).toBeNull();
  });
});

describe("deleting a profile", () => {
  it("removes it", () => {
    const created = createProfile("Ada", "5–6", storage);
    createProfile("Ben", "7–9", storage);
    if (!created.ok) throw new Error("setup failed");

    const state = deleteProfile(created.profile.id, storage);

    expect(state.profiles.map((profile) => profile.nickname)).toEqual(["Ben"]);
  });

  it("clears the selection if the deleted profile was the selected one", () => {
    const created = createProfile("Ada", "5–6", storage);
    if (!created.ok) throw new Error("setup failed");
    selectProfile(created.profile.id, storage);

    expect(
      deleteProfile(created.profile.id, storage).selectedProfileId,
    ).toBeNull();
  });

  it("leaves another profile's selection alone", () => {
    const ada = createProfile("Ada", "5–6", storage);
    const ben = createProfile("Ben", "7–9", storage);
    if (!ada.ok || !ben.ok) throw new Error("setup failed");
    selectProfile(ben.profile.id, storage);

    expect(deleteProfile(ada.profile.id, storage).selectedProfileId).toBe(
      ben.profile.id,
    );
  });
});

describe("failing safely", () => {
  it("treats corrupt data as no profiles", () => {
    const corrupt = createStorage({ [profileStorageKey]: "{ not json" });

    expect(readFamilyState(corrupt).profiles).toEqual([]);
  });

  it("drops a stored profile with a bad age band", () => {
    const tampered = createStorage({
      [profileStorageKey]: JSON.stringify({
        profiles: [
          { id: "a", nickname: "Ada", ageBand: "35–40", createdAt: "x" },
          { id: "b", nickname: "Ben", ageBand: "7–9", createdAt: "x" },
        ],
        selectedProfileId: null,
      }),
    });

    expect(
      readFamilyState(tampered).profiles.map((profile) => profile.nickname),
    ).toEqual(["Ben"]);
  });

  it("drops a stored profile with no nickname", () => {
    const tampered = createStorage({
      [profileStorageKey]: JSON.stringify({
        profiles: [{ id: "a", nickname: "  ", ageBand: "5–6", createdAt: "x" }],
        selectedProfileId: null,
      }),
    });

    expect(readFamilyState(tampered).profiles).toEqual([]);
  });

  it("ignores a selection pointing at a profile that is gone", () => {
    const tampered = createStorage({
      [profileStorageKey]: JSON.stringify({
        profiles: [
          { id: "a", nickname: "Ada", ageBand: "5–6", createdAt: "x" },
        ],
        selectedProfileId: "deleted-child",
      }),
    });

    expect(readFamilyState(tampered).selectedProfileId).toBeNull();
  });

  it("enforces the three-profile cap even against hand-edited storage", () => {
    const tampered = createStorage({
      [profileStorageKey]: JSON.stringify({
        profiles: Array.from({ length: 6 }, (_, index) => ({
          id: `child-${index}`,
          nickname: `Child ${index}`,
          ageBand: "5–6",
          createdAt: "x",
        })),
        selectedProfileId: null,
      }),
    });

    expect(readFamilyState(tampered).profiles).toHaveLength(maxProfiles);
  });

  it("does nothing at all when storage is unavailable", () => {
    expect(readFamilyState(null).profiles).toEqual([]);
    expect(() => selectProfile("anyone", null)).not.toThrow();
    expect(() => deleteProfile("anyone", null)).not.toThrow();
  });

  it("keeps the new profile in memory when a write is refused", () => {
    const full = createStorage();
    vi.spyOn(full, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    const result = createProfile("Ada", "5–6", full);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.profiles).toHaveLength(1);
  });
});
