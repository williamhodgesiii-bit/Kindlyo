import { beforeEach, describe, expect, it } from "vitest";
import type { AuthUser } from "@/features/auth/types";
import { emptyLessonProgress } from "@/features/lessons/lessonMachine";
import { createMemoryFamilyStore } from "./memoryStore";
import { createFamilyService, type FamilyService } from "./service";

/**
 * The authorization boundary, exercised against the in-memory store.
 *
 * The rule under test is the one the whole slice exists to hold:
 * `docs/ARCHITECTURE.md` — "every protected query must verify family
 * membership; never trust a family or child identifier supplied by the
 * browser". Two parents, two families; parent A is handed parent B's real
 * profile id and must get nowhere with it. A profile in another family is
 * indistinguishable from one that does not exist, so every denial is
 * `not-found`, which confirms nothing.
 */

const parentA: AuthUser = { id: "user-a", email: "a@example.com" };
const parentB: AuthUser = { id: "user-b", email: "b@example.com" };

let service: FamilyService;

beforeEach(() => {
  service = createFamilyService(createMemoryFamilyStore());
});

async function createProfileFor(
  user: AuthUser,
  nickname: string,
): Promise<string> {
  const result = await service.createProfile(user, {
    nickname,
    ageBand: "5–6",
  });
  if (!result.ok) throw new Error(`could not seed a profile: ${result.reason}`);
  return result.profile.id;
}

describe("family provisioning and scoping", () => {
  it("provisions a family lazily, with no profiles", async () => {
    const family = await service.getFamily(parentA);
    expect(family.profiles).toEqual([]);
    expect(family.onboardedAt).toBeNull();
  });

  it("gives two parents two separate families", async () => {
    await createProfileFor(parentA, "Ada");
    await createProfileFor(parentB, "Ben");

    const familyA = await service.getFamily(parentA);
    const familyB = await service.getFamily(parentB);

    expect(familyA.profiles.map((p) => p.nickname)).toEqual(["Ada"]);
    expect(familyB.profiles.map((p) => p.nickname)).toEqual(["Ben"]);
  });

  it("keeps a stable family across calls for the same parent", async () => {
    await createProfileFor(parentA, "Ada");
    await service.completeOnboarding(parentA);

    const family = await service.getFamily(parentA);
    expect(family.profiles).toHaveLength(1);
    expect(family.onboardedAt).not.toBeNull();
  });
});

describe("cross-family access is denied", () => {
  let profileB: string;

  beforeEach(async () => {
    // Parent A has their own child; parent B has the child A will try to reach.
    await createProfileFor(parentA, "Ada");
    profileB = await createProfileFor(parentB, "Ben");
  });

  it("does not reveal another family's child in the profile list", async () => {
    const family = await service.getFamily(parentA);
    expect(family.profiles.map((p) => p.nickname)).toEqual(["Ada"]);
    expect(family.profiles.some((p) => p.id === profileB)).toBe(false);
  });

  it("refuses to read another family's progress", async () => {
    const result = await service.getProgress(parentA, profileB);
    expect(result).toEqual({ ok: false, error: "not-found" });
  });

  it("refuses to update another family's profile, and leaves it untouched", async () => {
    const result = await service.updateProfile(parentA, profileB, {
      nickname: "Hijacked",
    });
    expect(result).toEqual({ ok: false, reason: "not-found" });

    const familyB = await service.getFamily(parentB);
    expect(familyB.profiles[0]?.nickname).toBe("Ben");
  });

  it("refuses to delete another family's profile, and leaves it in place", async () => {
    const result = await service.deleteProfile(parentA, profileB);
    expect(result).toEqual({ ok: false, error: "not-found" });

    const familyB = await service.getFamily(parentB);
    expect(familyB.profiles).toHaveLength(1);
  });

  it("refuses to point a parent's session at another family's child", async () => {
    const result = await service.selectProfile(parentA, profileB);
    expect(result).toEqual({ ok: false, error: "not-found" });

    const familyA = await service.getFamily(parentA);
    expect(familyA.selectedProfileId).toBeNull();
  });

  it("refuses to save a run against another family's child", async () => {
    const result = await service.saveRun(
      parentA,
      profileB,
      "saying-hello",
      1,
      emptyLessonProgress,
    );
    expect(result).toEqual({ ok: false, error: "not-found" });

    // And nothing was written to B's child.
    const progressB = await service.getProgress(parentB, profileB);
    expect(progressB.ok && progressB.progress).toEqual({});
  });

  it("refuses to record a completion against another family's child", async () => {
    const result = await service.recordCompletion(
      parentA,
      profileB,
      "saying-hello",
      1,
      "2026-08-05T10:00:00.000Z",
    );
    expect(result).toEqual({ ok: false, error: "not-found" });
  });

  it("refuses to mark a mission for another family's child", async () => {
    const result = await service.setMissionStatus(
      parentA,
      profileB,
      "saying-hello",
      "done",
    );
    expect(result).toEqual({ ok: false, error: "not-found" });
  });

  it("refuses to reset another family's progress", async () => {
    await service.recordCompletion(
      parentB,
      profileB,
      "saying-hello",
      1,
      "2026-08-05T10:00:00.000Z",
    );

    const result = await service.resetProgress(parentA, profileB);
    expect(result).toEqual({ ok: false, error: "not-found" });

    const progressB = await service.getProgress(parentB, profileB);
    expect(
      progressB.ok && progressB.progress["saying-hello"]?.completion,
    ).toBeDefined();
  });
});

describe("a parent's own family", () => {
  it("records and reads back a run, completion, and mission", async () => {
    const profile = await createProfileFor(parentA, "Ada");

    await service.saveRun(parentA, profile, "saying-hello", 1, {
      ...emptyLessonProgress,
      stepIndex: 2,
    });
    await service.recordCompletion(
      parentA,
      profile,
      "saying-hello",
      1,
      "2026-08-05T10:00:00.000Z",
    );
    await service.setMissionStatus(parentA, profile, "saying-hello", "done");

    const result = await service.getProgress(parentA, profile);
    if (!result.ok) throw new Error("expected progress");
    const entry = result.progress["saying-hello"];
    expect(entry?.run?.state.stepIndex).toBe(2);
    expect(entry?.completion?.completedAt).toBe("2026-08-05T10:00:00.000Z");
    expect(entry?.missionStatus).toBe("done");
  });

  it("keeps the first completion when a lesson is replayed", async () => {
    const profile = await createProfileFor(parentA, "Ada");
    await service.recordCompletion(
      parentA,
      profile,
      "saying-hello",
      1,
      "2026-08-05T10:00:00.000Z",
    );
    await service.recordCompletion(
      parentA,
      profile,
      "saying-hello",
      1,
      "2026-08-06T10:00:00.000Z",
    );

    const result = await service.getProgress(parentA, profile);
    expect(
      result.ok && result.progress["saying-hello"]?.completion?.completedAt,
    ).toBe("2026-08-05T10:00:00.000Z");
  });

  it("cascades a profile's progress away when the profile is deleted", async () => {
    const profile = await createProfileFor(parentA, "Ada");
    await service.recordCompletion(
      parentA,
      profile,
      "saying-hello",
      1,
      "2026-08-05T10:00:00.000Z",
    );

    const deleted = await service.deleteProfile(parentA, profile);
    expect(deleted.ok && deleted.state.profiles).toHaveLength(0);

    // The profile is gone, so its progress is unreachable — and a new profile
    // never inherits it.
    const orphan = await service.getProgress(parentA, profile);
    expect(orphan).toEqual({ ok: false, error: "not-found" });
  });

  it("enforces the three-profile cap", async () => {
    await createProfileFor(parentA, "Ada");
    await createProfileFor(parentA, "Ben");
    await createProfileFor(parentA, "Cal");

    const fourth = await service.createProfile(parentA, {
      nickname: "Dot",
      ageBand: "5–6",
    });
    expect(fourth).toEqual({ ok: false, reason: "limit" });
  });

  it("allows deselecting the active profile", async () => {
    const profile = await createProfileFor(parentA, "Ada");
    await service.selectProfile(parentA, profile);

    const cleared = await service.selectProfile(parentA, null);
    expect(cleared.ok && cleared.state.selectedProfileId).toBeNull();
  });
});
