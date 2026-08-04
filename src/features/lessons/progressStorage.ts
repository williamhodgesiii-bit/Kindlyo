import type { LessonProgress } from "./lessonMachine";

/**
 * Refresh-safe demo progress, in local storage.
 *
 * Deliberately small and deliberately temporary. Real progress belongs to a
 * child profile in the database and arrives with the persistence slice; this
 * exists so a reload mid-lesson does not throw a six-year-old back to the
 * first screen while we are still building.
 *
 * What is stored: a step index, the ids of the options chosen, and a
 * completion timestamp. No name, no age, no free text, nothing identifying —
 * so this stays on the right side of docs/PRIVACY_AND_SAFETY.md even though it
 * lives on a shared family device.
 *
 * Everything here is defensive. Local storage can be absent (server render),
 * disabled, full, or full of something another build wrote, and none of those
 * may break a lesson: on any problem we fall back to starting fresh.
 */

const STORAGE_KEY = "kindlyo.demo.lesson-progress.v1";

export type StoredLessonProgress = {
  /** The lesson version the progress was made against. */
  lessonVersion: number;
  state: LessonProgress;
};

type ProgressFile = Record<string, StoredLessonProgress>;

export function getBrowserStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    // Some browsers throw on access when storage is blocked entirely.
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseProgress(value: unknown): LessonProgress | null {
  if (!isRecord(value)) return null;
  const { stepIndex, choiceBySceneId, practiceOptionId, completedAt } = value;

  if (typeof stepIndex !== "number" || !Number.isInteger(stepIndex))
    return null;
  if (!isRecord(choiceBySceneId)) return null;
  if (practiceOptionId !== null && typeof practiceOptionId !== "string")
    return null;
  if (completedAt !== null && typeof completedAt !== "string") return null;

  const choices: Record<string, string> = {};
  for (const [sceneId, choiceId] of Object.entries(choiceBySceneId)) {
    if (typeof choiceId === "string") choices[sceneId] = choiceId;
  }

  return {
    stepIndex,
    choiceBySceneId: choices,
    practiceOptionId,
    completedAt,
  };
}

function readFile(storage: Storage): ProgressFile {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return {};
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? (parsed as ProgressFile) : {};
  } catch {
    // Corrupt JSON, or a storage read that threw. Treat as no progress.
    return {};
  }
}

/**
 * Returns saved progress for a lesson, or null.
 *
 * Progress saved against a different lesson version is discarded rather than
 * resumed: the step it points at may no longer be the step it meant
 * (docs/CONTENT_SCHEMA.md — a revision creates a new version).
 */
export function readLessonProgress(
  lessonId: string,
  lessonVersion: number,
  storage: Storage | null = getBrowserStorage(),
): LessonProgress | null {
  if (storage === null) return null;

  const entry = readFile(storage)[lessonId];
  if (!isRecord(entry)) return null;
  if (entry.lessonVersion !== lessonVersion) return null;

  return parseProgress(entry.state);
}

export function writeLessonProgress(
  lessonId: string,
  lessonVersion: number,
  progress: LessonProgress,
  storage: Storage | null = getBrowserStorage(),
): void {
  if (storage === null) return;

  try {
    const file = readFile(storage);
    file[lessonId] = { lessonVersion, state: progress };
    storage.setItem(STORAGE_KEY, JSON.stringify(file));
  } catch {
    // Quota exceeded, or storage disabled mid-session. Losing demo progress is
    // an acceptable outcome; interrupting the lesson is not.
  }
}

export function clearLessonProgress(
  lessonId: string,
  storage: Storage | null = getBrowserStorage(),
): void {
  if (storage === null) return;

  try {
    const file = readFile(storage);
    delete file[lessonId];
    storage.setItem(STORAGE_KEY, JSON.stringify(file));
  } catch {
    // Nothing useful to do; the next write will overwrite the entry anyway.
  }
}

export const lessonProgressStorageKey = STORAGE_KEY;
