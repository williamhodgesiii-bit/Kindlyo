import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LessonProgress } from "./lessonMachine";
import {
  clearLessonProgress,
  lessonProgressStorageKey,
  readLessonProgress,
  writeLessonProgress,
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

const state: LessonProgress = {
  stepIndex: 4,
  choiceBySceneId: { decision: "second" },
  practiceOptionId: "practice-one",
  completedAt: null,
};

let storage: Storage;

beforeEach(() => {
  storage = createStorage();
});

describe("lesson progress storage", () => {
  it("round-trips progress for a lesson", () => {
    writeLessonProgress("test-lesson", 1, state, storage);

    expect(readLessonProgress("test-lesson", 1, storage)).toEqual(state);
  });

  it("keeps lessons separate", () => {
    writeLessonProgress("lesson-one", 1, state, storage);
    writeLessonProgress("lesson-two", 1, { ...state, stepIndex: 1 }, storage);

    expect(readLessonProgress("lesson-one", 1, storage)?.stepIndex).toBe(4);
    expect(readLessonProgress("lesson-two", 1, storage)?.stepIndex).toBe(1);
  });

  it("returns nothing when there is no saved progress", () => {
    expect(readLessonProgress("test-lesson", 1, storage)).toBeNull();
  });

  it("discards progress saved against a different lesson version", () => {
    writeLessonProgress("test-lesson", 1, state, storage);

    expect(readLessonProgress("test-lesson", 2, storage)).toBeNull();
  });

  it("survives corrupt stored data", () => {
    const corrupt = createStorage({
      [lessonProgressStorageKey]: "{ not json",
    });

    expect(readLessonProgress("test-lesson", 1, corrupt)).toBeNull();
  });

  it("ignores a saved entry of the wrong shape", () => {
    const tampered = createStorage({
      [lessonProgressStorageKey]: JSON.stringify({
        "test-lesson": { lessonVersion: 1, state: { stepIndex: "four" } },
      }),
    });

    expect(readLessonProgress("test-lesson", 1, tampered)).toBeNull();
  });

  it("drops non-string choice values rather than trusting them", () => {
    const tampered = createStorage({
      [lessonProgressStorageKey]: JSON.stringify({
        "test-lesson": {
          lessonVersion: 1,
          state: {
            stepIndex: 1,
            choiceBySceneId: { decision: 7 },
            practiceOptionId: null,
            completedAt: null,
          },
        },
      }),
    });

    expect(
      readLessonProgress("test-lesson", 1, tampered)?.choiceBySceneId,
    ).toEqual({});
  });

  it("forgets a lesson when its progress is cleared", () => {
    writeLessonProgress("test-lesson", 1, state, storage);
    clearLessonProgress("test-lesson", storage);

    expect(readLessonProgress("test-lesson", 1, storage)).toBeNull();
  });

  it("does nothing at all when storage is unavailable", () => {
    expect(() =>
      writeLessonProgress("test-lesson", 1, state, null),
    ).not.toThrow();
    expect(readLessonProgress("test-lesson", 1, null)).toBeNull();
    expect(() => clearLessonProgress("test-lesson", null)).not.toThrow();
  });

  it("keeps going when a write is refused", () => {
    const full = createStorage();
    vi.spyOn(full, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(() =>
      writeLessonProgress("test-lesson", 1, state, full),
    ).not.toThrow();
  });

  it("stores no free text or identifying information", () => {
    writeLessonProgress("test-lesson", 1, state, storage);
    const raw = storage.getItem(lessonProgressStorageKey) ?? "";

    // Only ids, a step index, a version, and a timestamp field.
    expect(JSON.parse(raw)).toEqual({
      "test-lesson": { lessonVersion: 1, state },
    });
  });
});
