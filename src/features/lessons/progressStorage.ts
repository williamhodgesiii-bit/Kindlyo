import type { LessonProgress } from "./lessonMachine";

/**
 * Refresh-safe demo progress, in local storage, scoped per child profile.
 *
 * Version 2 of the store. The v1 key held a single anonymous track; v2 nests
 * everything under a profile id so one child's progress can never appear for
 * another child, which is a product rule rather than a nicety. The v1 key is
 * simply ignored — outdated data failing safely beats a migration for demo
 * progress.
 *
 * Shape, one entry per (profile, lesson):
 *
 *   {
 *     [profileId]: {
 *       [lessonId]: {
 *         run?:        { lessonVersion, state }        mid-lesson position
 *         completion?: { lessonVersion, completedAt }  the record that counts
 *         missionStatus?: "done"                       parent-marked
 *       }
 *     }
 *   }
 *
 * Two version rules, deliberately different:
 *
 * - A `run` is version-strict: resumed only against the exact lesson version
 *   it was made on, because the step it points at may have moved.
 * - A `completion` records the version but survives revisions: a content edit
 *   must not silently erase a child's finished lessons.
 *
 * What is stored: ids, indexes, versions, timestamps. No nickname, no age, no
 * free text — the profile id is a random UUID that means nothing outside this
 * browser (docs/PRIVACY_AND_SAFETY.md).
 *
 * Everything is defensive: storage can be absent, disabled, full, or edited by
 * hand, and on any problem the answer is "no saved progress", never a broken
 * lesson.
 */

const STORAGE_KEY = "kindlyo.demo.lesson-progress.v2";

export type LessonCompletion = {
  /** The lesson version that was completed (a product rule, recorded here). */
  lessonVersion: number;
  /** ISO timestamp. */
  completedAt: string;
};

export type MissionStatus = "done";

export type LessonProgressEntry = {
  run?: { lessonVersion: number; state: LessonProgress };
  completion?: LessonCompletion;
  missionStatus?: MissionStatus;
};

/** One profile's validated progress, keyed by lesson id. */
export type ProfileProgress = Record<string, LessonProgressEntry>;

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

function parseRunState(value: unknown): LessonProgress | null {
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

  return { stepIndex, choiceBySceneId: choices, practiceOptionId, completedAt };
}

/** Keeps only the parts of a stored entry that are what they claim to be. */
function parseEntry(value: unknown): LessonProgressEntry | null {
  if (!isRecord(value)) return null;
  const entry: LessonProgressEntry = {};

  if (isRecord(value.run)) {
    const state = parseRunState(value.run.state);
    if (state !== null && typeof value.run.lessonVersion === "number") {
      entry.run = { lessonVersion: value.run.lessonVersion, state };
    }
  }

  if (isRecord(value.completion)) {
    const { lessonVersion, completedAt } = value.completion;
    if (typeof lessonVersion === "number" && typeof completedAt === "string") {
      entry.completion = { lessonVersion, completedAt };
    }
  }

  if (value.missionStatus === "done") entry.missionStatus = "done";

  return Object.keys(entry).length > 0 ? entry : null;
}

type ProgressFile = Record<string, unknown>;

function readFile(storage: Storage): ProgressFile {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return {};
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? parsed : {};
  } catch {
    // Corrupt JSON, or a storage read that threw. Treat as no progress.
    return {};
  }
}

function writeFile(storage: Storage, file: ProgressFile): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(file));
  } catch {
    // Quota exceeded, or storage disabled mid-session. Losing demo progress is
    // an acceptable outcome; interrupting the lesson is not.
  }
}

/** One profile's progress, validated entry by entry. */
export function readProfileProgress(
  profileId: string,
  storage: Storage | null = getBrowserStorage(),
): ProfileProgress {
  if (storage === null) return {};

  const node = readFile(storage)[profileId];
  if (!isRecord(node)) return {};

  const progress: ProfileProgress = {};
  for (const [lessonId, rawEntry] of Object.entries(node)) {
    const entry = parseEntry(rawEntry);
    if (entry !== null) progress[lessonId] = entry;
  }
  return progress;
}

function updateEntry(
  profileId: string,
  lessonId: string,
  storage: Storage | null,
  update: (entry: LessonProgressEntry) => LessonProgressEntry | null,
): void {
  if (storage === null) return;

  const file = readFile(storage);
  const rawNode = file[profileId];
  const node = isRecord(rawNode) ? rawNode : {};
  const current = parseEntry(node[lessonId]) ?? {};
  const next = update(current);

  const updatedNode = { ...node };
  if (next === null) {
    delete updatedNode[lessonId];
  } else {
    updatedNode[lessonId] = next;
  }

  writeFile(storage, { ...file, [profileId]: updatedNode });
}

/**
 * Mid-lesson position for one child, or null. Version-strict: a run saved
 * against a different lesson version is discarded rather than resumed.
 */
export function readLessonRun(
  profileId: string,
  lessonId: string,
  lessonVersion: number,
  storage: Storage | null = getBrowserStorage(),
): LessonProgress | null {
  const run = readProfileProgress(profileId, storage)[lessonId]?.run;
  if (run === undefined || run.lessonVersion !== lessonVersion) return null;
  return run.state;
}

export function writeLessonRun(
  profileId: string,
  lessonId: string,
  lessonVersion: number,
  state: LessonProgress,
  storage: Storage | null = getBrowserStorage(),
): void {
  updateEntry(profileId, lessonId, storage, (entry) => ({
    ...entry,
    run: { lessonVersion, state },
  }));
}

/** Drops the mid-lesson position, keeping any completion and mission status. */
export function clearLessonRun(
  profileId: string,
  lessonId: string,
  storage: Storage | null = getBrowserStorage(),
): void {
  updateEntry(profileId, lessonId, storage, (entry) => {
    const { run: _run, ...rest } = entry;
    return Object.keys(rest).length > 0 ? rest : null;
  });
}

/**
 * Marks a lesson complete for one child. First completion wins: replaying a
 * lesson never rewrites when it was first finished.
 */
export function recordCompletion(
  profileId: string,
  lessonId: string,
  lessonVersion: number,
  completedAt: string,
  storage: Storage | null = getBrowserStorage(),
): void {
  updateEntry(profileId, lessonId, storage, (entry) =>
    entry.completion !== undefined
      ? entry
      : { ...entry, completion: { lessonVersion, completedAt } },
  );
}

/** Parent-marked, from the dashboard. Passing null returns it to suggested. */
export function setMissionStatus(
  profileId: string,
  lessonId: string,
  status: MissionStatus | null,
  storage: Storage | null = getBrowserStorage(),
): void {
  updateEntry(profileId, lessonId, storage, (entry) => {
    if (status === null) {
      const { missionStatus: _missionStatus, ...rest } = entry;
      return Object.keys(rest).length > 0 ? rest : null;
    }
    return { ...entry, missionStatus: status };
  });
}

/**
 * Removes everything stored for one profile — and only that profile. Used by
 * the parent's reset-progress control and when a profile is deleted.
 */
export function resetProfileProgress(
  profileId: string,
  storage: Storage | null = getBrowserStorage(),
): void {
  if (storage === null) return;

  const file = readFile(storage);
  if (!(profileId in file)) return;
  delete file[profileId];
  writeFile(storage, file);
}

export const lessonProgressStorageKey = STORAGE_KEY;
