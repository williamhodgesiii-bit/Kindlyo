import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  completeOnboarding,
  createProfile,
  deleteProfile,
  profileStorageKey,
  readFamilyState,
  selectProfile,
  updateProfile,
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
    const result = createProfile({ nickname: "Ada", ageBand: "5–6" }, storage);

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
    createProfile({ nickname: "Ada", ageBand: "5–6" }, storage);

    const state = readFamilyState(storage);
    expect(state.profiles).toHaveLength(1);
    expect(state.profiles[0]?.nickname).toBe("Ada");
    expect(state.profiles[0]?.ageBand).toBe("5–6");
  });

  it("gives every profile its own id", () => {
    const first = createProfile({ nickname: "Ada", ageBand: "5–6" }, storage);
    const second = createProfile({ nickname: "Ben", ageBand: "7–9" }, storage);

    expect(
      first.ok && second.ok && first.profile.id !== second.profile.id,
    ).toBe(true);
  });

  it("trims the nickname", () => {
    createProfile({ nickname: "  Ada  ", ageBand: "5–6" }, storage);

    expect(readFamilyState(storage).profiles[0]?.nickname).toBe("Ada");
  });

  it("refuses a nickname that is only whitespace", () => {
    const result = createProfile({ nickname: "   ", ageBand: "5–6" }, storage);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("empty-nickname");
    expect(readFamilyState(storage).profiles).toHaveLength(0);
  });

  it("stops at three profiles", () => {
    createProfile({ nickname: "Ada", ageBand: "5–6" }, storage);
    createProfile({ nickname: "Ben", ageBand: "5–6" }, storage);
    createProfile({ nickname: "Cal", ageBand: "7–9" }, storage);

    const fourth = createProfile({ nickname: "Dee", ageBand: "7–9" }, storage);

    expect(fourth.ok).toBe(false);
    if (fourth.ok) return;
    expect(fourth.reason).toBe("limit");
    expect(readFamilyState(storage).profiles).toHaveLength(maxProfiles);
  });
});

describe("selecting a profile", () => {
  it("remembers who is learning", () => {
    const created = createProfile({ nickname: "Ada", ageBand: "5–6" }, storage);
    if (!created.ok) throw new Error("setup failed");

    const state = selectProfile(created.profile.id, storage);

    expect(state.selectedProfileId).toBe(created.profile.id);
    expect(readFamilyState(storage).selectedProfileId).toBe(created.profile.id);
  });

  it("clears the selection when given null", () => {
    const created = createProfile({ nickname: "Ada", ageBand: "5–6" }, storage);
    if (!created.ok) throw new Error("setup failed");
    selectProfile(created.profile.id, storage);

    expect(selectProfile(null, storage).selectedProfileId).toBeNull();
  });

  it("refuses to select a profile that does not exist", () => {
    createProfile({ nickname: "Ada", ageBand: "5–6" }, storage);

    expect(selectProfile("someone-else", storage).selectedProfileId).toBeNull();
  });
});

describe("deleting a profile", () => {
  it("removes it", () => {
    const created = createProfile({ nickname: "Ada", ageBand: "5–6" }, storage);
    createProfile({ nickname: "Ben", ageBand: "7–9" }, storage);
    if (!created.ok) throw new Error("setup failed");

    const state = deleteProfile(created.profile.id, storage);

    expect(state.profiles.map((profile) => profile.nickname)).toEqual(["Ben"]);
  });

  it("clears the selection if the deleted profile was the selected one", () => {
    const created = createProfile({ nickname: "Ada", ageBand: "5–6" }, storage);
    if (!created.ok) throw new Error("setup failed");
    selectProfile(created.profile.id, storage);

    expect(
      deleteProfile(created.profile.id, storage).selectedProfileId,
    ).toBeNull();
  });

  it("leaves another profile's selection alone", () => {
    const ada = createProfile({ nickname: "Ada", ageBand: "5–6" }, storage);
    const ben = createProfile({ nickname: "Ben", ageBand: "7–9" }, storage);
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

    const result = createProfile({ nickname: "Ada", ageBand: "5–6" }, full);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.profiles).toHaveLength(1);
  });
});

describe("editing a profile", () => {
  function seed(nickname = "Ada") {
    const result = createProfile({ nickname, ageBand: "5–6" }, storage);
    if (!result.ok) throw new Error("setup failed");
    return result.profile;
  }

  it("renames without changing the id", () => {
    const ada = seed();

    const result = updateProfile(ada.id, { nickname: "Adaline" }, storage);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.profile.id).toBe(ada.id);
    expect(readFamilyState(storage).profiles[0]?.nickname).toBe("Adaline");
  });

  it("leaves fields the draft does not mention alone", () => {
    const ada = createProfile(
      { nickname: "Ada", ageBand: "5–6", avatarId: "fox" },
      storage,
    );
    if (!ada.ok) throw new Error("setup failed");

    updateProfile(ada.profile.id, { nickname: "Adaline" }, storage);

    const stored = readFamilyState(storage).profiles[0];
    expect(stored?.ageBand).toBe("5–6");
    expect(stored?.avatarId).toBe("fox");
  });

  it("changes the age band", () => {
    const ada = seed();

    updateProfile(ada.id, { ageBand: "7–9" }, storage);

    expect(readFamilyState(storage).profiles[0]?.ageBand).toBe("7–9");
  });

  it("adds an avatar", () => {
    const ada = seed();

    updateProfile(ada.id, { avatarId: "star" }, storage);

    expect(readFamilyState(storage).profiles[0]?.avatarId).toBe("star");
  });

  it("clears an avatar when the draft says null", () => {
    const ada = createProfile(
      { nickname: "Ada", ageBand: "5–6", avatarId: "fox" },
      storage,
    );
    if (!ada.ok) throw new Error("setup failed");

    updateProfile(ada.profile.id, { avatarId: null }, storage);

    expect(readFamilyState(storage).profiles[0]?.avatarId).toBeUndefined();
  });

  it("trims the new nickname", () => {
    const ada = seed();

    updateProfile(ada.id, { nickname: "  Adaline  " }, storage);

    expect(readFamilyState(storage).profiles[0]?.nickname).toBe("Adaline");
  });

  it("refuses an empty nickname and changes nothing", () => {
    const ada = seed();

    const result = updateProfile(ada.id, { nickname: "   " }, storage);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("empty-nickname");
    expect(readFamilyState(storage).profiles[0]?.nickname).toBe("Ada");
  });

  it("reports a profile that is not there", () => {
    const result = updateProfile("nobody", { nickname: "Ghost" }, storage);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("not-found");
  });

  it("edits only the profile it was asked to edit", () => {
    const ada = seed("Ada");
    seed("Ben");

    updateProfile(ada.id, { nickname: "Adaline" }, storage);

    expect(
      readFamilyState(storage).profiles.map((profile) => profile.nickname),
    ).toEqual(["Adaline", "Ben"]);
  });
});

describe("avatars", () => {
  it("stores one when it is chosen", () => {
    createProfile(
      { nickname: "Ada", ageBand: "5–6", avatarId: "moon" },
      storage,
    );

    expect(readFamilyState(storage).profiles[0]?.avatarId).toBe("moon");
  });

  it("leaves the field out when none is chosen", () => {
    createProfile({ nickname: "Ada", ageBand: "5–6" }, storage);

    expect("avatarId" in (readFamilyState(storage).profiles[0] ?? {})).toBe(
      false,
    );
  });

  it("drops an unrecognised avatar rather than the whole profile", () => {
    const tampered = createStorage({
      [profileStorageKey]: JSON.stringify({
        profiles: [
          {
            id: "a",
            nickname: "Ada",
            ageBand: "5–6",
            avatarId: "https://example.com/photo.jpg",
            createdAt: "x",
          },
        ],
        selectedProfileId: null,
        onboardedAt: null,
      }),
    });

    const stored = readFamilyState(tampered).profiles[0];
    expect(stored?.nickname).toBe("Ada");
    expect(stored?.avatarId).toBeUndefined();
  });
});

describe("onboarding", () => {
  it("starts unfinished", () => {
    expect(readFamilyState(storage).onboardedAt).toBeNull();
  });

  it("records when it was completed", () => {
    completeOnboarding(storage, "2026-08-04T10:00:00.000Z");

    expect(readFamilyState(storage).onboardedAt).toBe(
      "2026-08-04T10:00:00.000Z",
    );
  });

  it("keeps the first completion", () => {
    completeOnboarding(storage, "2026-08-04T10:00:00.000Z");
    completeOnboarding(storage, "2026-08-09T10:00:00.000Z");

    expect(readFamilyState(storage).onboardedAt).toBe(
      "2026-08-04T10:00:00.000Z",
    );
  });

  it("survives deleting every profile", () => {
    const ada = createProfile({ nickname: "Ada", ageBand: "5–6" }, storage);
    if (!ada.ok) throw new Error("setup failed");
    completeOnboarding(storage, "2026-08-04T10:00:00.000Z");

    deleteProfile(ada.profile.id, storage);

    expect(readFamilyState(storage).profiles).toHaveLength(0);
    expect(readFamilyState(storage).onboardedAt).not.toBeNull();
  });

  it("ignores a nonsense stored value", () => {
    const tampered = createStorage({
      [profileStorageKey]: JSON.stringify({
        profiles: [],
        selectedProfileId: null,
        onboardedAt: 12345,
      }),
    });

    expect(readFamilyState(tampered).onboardedAt).toBeNull();
  });
});

describe("what is stored", () => {
  it("holds a nickname, an age band, an avatar id, and timestamps — nothing else", () => {
    createProfile(
      { nickname: "Ada", ageBand: "5–6", avatarId: "fox" },
      storage,
    );
    const raw = storage.getItem(profileStorageKey) ?? "";
    const parsed = JSON.parse(raw) as {
      profiles: Record<string, unknown>[];
    };

    expect(Object.keys(parsed.profiles[0] ?? {}).sort()).toEqual([
      "ageBand",
      "avatarId",
      "createdAt",
      "id",
      "nickname",
    ]);
  });
});
