import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LessonProgress } from "./lessonMachine";
import {
  clearLessonRun,
  lessonProgressStorageKey,
  readLessonRun,
  readProfileProgress,
  recordCompletion,
  resetProfileProgress,
  setMissionStatus,
  writeLessonRun,
} from "./progressStorage";

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

const run: LessonProgress = {
  stepIndex: 4,
  choiceBySceneId: { decision: "second" },
  practiceOptionId: "practice-one",
  completedAt: null,
};

const ADA = "profile-ada";
const BEN = "profile-ben";

let storage: Storage;

beforeEach(() => {
  storage = createStorage();
});

describe("mid-lesson runs", () => {
  it("round-trips a run for a lesson", () => {
    writeLessonRun(ADA, "saying-hello", 1, run, storage);

    expect(readLessonRun(ADA, "saying-hello", 1, storage)).toEqual(run);
  });

  it("keeps lessons separate", () => {
    writeLessonRun(ADA, "lesson-one", 1, run, storage);
    writeLessonRun(ADA, "lesson-two", 1, { ...run, stepIndex: 1 }, storage);

    expect(readLessonRun(ADA, "lesson-one", 1, storage)?.stepIndex).toBe(4);
    expect(readLessonRun(ADA, "lesson-two", 1, storage)?.stepIndex).toBe(1);
  });

  it("returns nothing when there is no saved run", () => {
    expect(readLessonRun(ADA, "saying-hello", 1, storage)).toBeNull();
  });

  it("discards a run saved against a different lesson version", () => {
    writeLessonRun(ADA, "saying-hello", 1, run, storage);

    expect(readLessonRun(ADA, "saying-hello", 2, storage)).toBeNull();
  });

  it("clears a run without touching the completion beside it", () => {
    writeLessonRun(ADA, "saying-hello", 1, run, storage);
    recordCompletion(
      ADA,
      "saying-hello",
      1,
      "2026-08-04T10:00:00.000Z",
      storage,
    );

    clearLessonRun(ADA, "saying-hello", storage);

    expect(readLessonRun(ADA, "saying-hello", 1, storage)).toBeNull();
    expect(
      readProfileProgress(ADA, storage)["saying-hello"]?.completion,
    ).toBeDefined();
  });
});

describe("profile separation", () => {
  it("never shows one child's run to another child", () => {
    writeLessonRun(ADA, "saying-hello", 1, run, storage);

    expect(readLessonRun(ADA, "saying-hello", 1, storage)).toEqual(run);
    expect(readLessonRun(BEN, "saying-hello", 1, storage)).toBeNull();
  });

  it("never shows one child's completions to another child", () => {
    recordCompletion(
      ADA,
      "saying-hello",
      1,
      "2026-08-04T10:00:00.000Z",
      storage,
    );

    expect(readProfileProgress(ADA, storage)["saying-hello"]).toBeDefined();
    expect(readProfileProgress(BEN, storage)).toEqual({});
  });

  it("keeps two children's progress on the same lesson apart", () => {
    writeLessonRun(ADA, "saying-hello", 1, run, storage);
    writeLessonRun(BEN, "saying-hello", 1, { ...run, stepIndex: 0 }, storage);

    expect(readLessonRun(ADA, "saying-hello", 1, storage)?.stepIndex).toBe(4);
    expect(readLessonRun(BEN, "saying-hello", 1, storage)?.stepIndex).toBe(0);
  });

  it("resets only the profile it was asked to reset", () => {
    recordCompletion(
      ADA,
      "saying-hello",
      1,
      "2026-08-04T10:00:00.000Z",
      storage,
    );
    recordCompletion(
      BEN,
      "saying-hello",
      1,
      "2026-08-04T11:00:00.000Z",
      storage,
    );

    resetProfileProgress(ADA, storage);

    expect(readProfileProgress(ADA, storage)).toEqual({});
    expect(readProfileProgress(BEN, storage)["saying-hello"]).toBeDefined();
  });

  it("survives a reset for a profile that has no progress", () => {
    expect(() => resetProfileProgress(BEN, storage)).not.toThrow();
  });
});

describe("completions", () => {
  it("records the lesson version that was completed", () => {
    recordCompletion(
      ADA,
      "saying-hello",
      3,
      "2026-08-04T10:00:00.000Z",
      storage,
    );

    expect(
      readProfileProgress(ADA, storage)["saying-hello"]?.completion,
    ).toEqual({ lessonVersion: 3, completedAt: "2026-08-04T10:00:00.000Z" });
  });

  it("keeps the first completion when a lesson is played again", () => {
    recordCompletion(
      ADA,
      "saying-hello",
      1,
      "2026-08-04T10:00:00.000Z",
      storage,
    );
    recordCompletion(
      ADA,
      "saying-hello",
      1,
      "2026-08-09T10:00:00.000Z",
      storage,
    );

    expect(
      readProfileProgress(ADA, storage)["saying-hello"]?.completion
        ?.completedAt,
    ).toBe("2026-08-04T10:00:00.000Z");
  });

  it("survives a lesson version bump, unlike a run", () => {
    writeLessonRun(ADA, "saying-hello", 1, run, storage);
    recordCompletion(
      ADA,
      "saying-hello",
      1,
      "2026-08-04T10:00:00.000Z",
      storage,
    );

    // A revision invalidates the resumable position but not the achievement.
    expect(readLessonRun(ADA, "saying-hello", 2, storage)).toBeNull();
    expect(
      readProfileProgress(ADA, storage)["saying-hello"]?.completion,
    ).toBeDefined();
  });
});

describe("offline mission status", () => {
  it("marks a mission done and back again", () => {
    recordCompletion(
      ADA,
      "saying-hello",
      1,
      "2026-08-04T10:00:00.000Z",
      storage,
    );

    setMissionStatus(ADA, "saying-hello", "done", storage);
    expect(
      readProfileProgress(ADA, storage)["saying-hello"]?.missionStatus,
    ).toBe("done");

    setMissionStatus(ADA, "saying-hello", null, storage);
    expect(
      readProfileProgress(ADA, storage)["saying-hello"]?.missionStatus,
    ).toBeUndefined();
  });

  it("keeps one child's mission status off another child's mission", () => {
    setMissionStatus(ADA, "saying-hello", "done", storage);

    expect(
      readProfileProgress(BEN, storage)["saying-hello"]?.missionStatus,
    ).toBeUndefined();
  });
});

describe("failing safely", () => {
  it("survives corrupt stored data", () => {
    const corrupt = createStorage({ [lessonProgressStorageKey]: "{ not json" });

    expect(readProfileProgress(ADA, corrupt)).toEqual({});
    expect(readLessonRun(ADA, "saying-hello", 1, corrupt)).toBeNull();
  });

  it("ignores a saved run of the wrong shape", () => {
    const tampered = createStorage({
      [lessonProgressStorageKey]: JSON.stringify({
        [ADA]: {
          "saying-hello": {
            run: { lessonVersion: 1, state: { stepIndex: "4" } },
          },
        },
      }),
    });

    expect(readLessonRun(ADA, "saying-hello", 1, tampered)).toBeNull();
  });

  it("ignores a completion of the wrong shape", () => {
    const tampered = createStorage({
      [lessonProgressStorageKey]: JSON.stringify({
        [ADA]: { "saying-hello": { completion: { lessonVersion: "one" } } },
      }),
    });

    expect(readProfileProgress(ADA, tampered)).toEqual({});
  });

  it("ignores a profile node that is not an object", () => {
    const tampered = createStorage({
      [lessonProgressStorageKey]: JSON.stringify({ [ADA]: "everything" }),
    });

    expect(readProfileProgress(ADA, tampered)).toEqual({});
  });

  it("ignores a mission status it does not recognise", () => {
    const tampered = createStorage({
      [lessonProgressStorageKey]: JSON.stringify({
        [ADA]: { "saying-hello": { missionStatus: "amazing" } },
      }),
    });

    expect(readProfileProgress(ADA, tampered)).toEqual({});
  });

  it("drops non-string choice values rather than trusting them", () => {
    const tampered = createStorage({
      [lessonProgressStorageKey]: JSON.stringify({
        [ADA]: {
          "saying-hello": {
            run: {
              lessonVersion: 1,
              state: {
                stepIndex: 1,
                choiceBySceneId: { decision: 7 },
                practiceOptionId: null,
                completedAt: null,
              },
            },
          },
        },
      }),
    });

    expect(
      readLessonRun(ADA, "saying-hello", 1, tampered)?.choiceBySceneId,
    ).toEqual({});
  });

  it("ignores whatever the previous version of this store wrote", () => {
    const v1 = createStorage({
      "kindlyo.demo.lesson-progress.v1": JSON.stringify({
        "saying-hello": { lessonVersion: 1, state: run },
      }),
    });

    expect(readProfileProgress(ADA, v1)).toEqual({});
  });

  it("does nothing at all when storage is unavailable", () => {
    expect(() =>
      writeLessonRun(ADA, "saying-hello", 1, run, null),
    ).not.toThrow();
    expect(readLessonRun(ADA, "saying-hello", 1, null)).toBeNull();
    expect(readProfileProgress(ADA, null)).toEqual({});
    expect(() => resetProfileProgress(ADA, null)).not.toThrow();
  });

  it("keeps going when a write is refused", () => {
    const full = createStorage();
    vi.spyOn(full, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(() =>
      writeLessonRun(ADA, "saying-hello", 1, run, full),
    ).not.toThrow();
  });
});

describe("what is stored", () => {
  it("holds ids, versions, and timestamps — nothing identifying", () => {
    writeLessonRun(
      ADA,
      "saying-hello",
      1,
      run,
      storage,
      "2026-08-04T09:00:00.000Z",
    );
    recordCompletion(
      ADA,
      "saying-hello",
      1,
      "2026-08-04T10:00:00.000Z",
      storage,
    );
    const raw = storage.getItem(lessonProgressStorageKey) ?? "";

    expect(JSON.parse(raw)).toEqual({
      [ADA]: {
        "saying-hello": {
          run: { lessonVersion: 1, state: run },
          completion: {
            lessonVersion: 1,
            completedAt: "2026-08-04T10:00:00.000Z",
          },
          updatedAt: "2026-08-04T10:00:00.000Z",
        },
      },
    });
  });
});

describe("activity timestamps", () => {
  it("records when the child last touched a lesson", () => {
    writeLessonRun(
      ADA,
      "saying-hello",
      1,
      run,
      storage,
      "2026-08-04T09:00:00.000Z",
    );

    expect(readProfileProgress(ADA, storage)["saying-hello"]?.updatedAt).toBe(
      "2026-08-04T09:00:00.000Z",
    );
  });

  it("moves the clock on a replay, even though the completion does not change", () => {
    recordCompletion(
      ADA,
      "saying-hello",
      1,
      "2026-08-04T10:00:00.000Z",
      storage,
    );
    recordCompletion(
      ADA,
      "saying-hello",
      1,
      "2026-08-09T10:00:00.000Z",
      storage,
    );

    const entry = readProfileProgress(ADA, storage)["saying-hello"];
    expect(entry?.completion?.completedAt).toBe("2026-08-04T10:00:00.000Z");
    expect(entry?.updatedAt).toBe("2026-08-09T10:00:00.000Z");
  });

  it("is not moved by a parent marking a mission", () => {
    writeLessonRun(
      ADA,
      "saying-hello",
      1,
      run,
      storage,
      "2026-08-04T09:00:00.000Z",
    );

    setMissionStatus(ADA, "saying-hello", "done", storage);

    expect(readProfileProgress(ADA, storage)["saying-hello"]?.updatedAt).toBe(
      "2026-08-04T09:00:00.000Z",
    );
  });

  it("ignores a stored value that is not a string", () => {
    const tampered = createStorage({
      [lessonProgressStorageKey]: JSON.stringify({
        [ADA]: { "saying-hello": { updatedAt: 1234, missionStatus: "done" } },
      }),
    });

    expect(
      readProfileProgress(ADA, tampered)["saying-hello"]?.updatedAt,
    ).toBeUndefined();
  });
});
