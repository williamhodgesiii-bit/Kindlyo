import type { CurriculumModule } from "@/content/modules";
import type { Lesson } from "@/features/curriculum/schema";
import type { ProfileProgress } from "./progressStorage";

/**
 * Derives one child's view of a module: which lessons are locked, available,
 * in progress, or complete, how far through the module they are, and where
 * "Continue" should go.
 *
 * Pure, like the lesson reducer, so the unlock rules live in one tested place
 * and no screen can invent different ones (docs/ARCHITECTURE.md,
 * "Boundaries").
 *
 * The rules:
 *
 * - The first written lesson is always available.
 * - Completing a lesson unlocks the next written one. Unwritten entries are
 *   shown as "being written" and skipped by the chain — a child is never
 *   locked out by our authoring backlog.
 * - Complete beats in-progress: replaying a finished lesson leaves it
 *   complete. Finished lessons stay open — locking a child out of a story
 *   they liked would be a punitive mechanic.
 * - A saved run counts as in-progress only if it matches the current lesson
 *   version; a stale run is not resumable, so it must not claim "Continue".
 * - Position is progress ("3 of 8"), never a score, a streak, or a deficit.
 */

export type PathLessonState =
  "locked" | "available" | "in-progress" | "complete" | "unwritten";

export type PathLesson = {
  order: number;
  title: string;
  /** Present when the lesson has authored content. */
  lesson?: Lesson;
  state: PathLessonState;
  /** ISO timestamp of the first completion, when complete. */
  completedAt?: string;
  missionDone?: boolean;
};

export type ModulePath = {
  lessons: readonly PathLesson[];
  /** Written lessons completed / written lessons in the module. */
  completedCount: number;
  lessonCount: number;
  /** Where "Continue" goes: the in-progress lesson, else the next available. */
  resume: PathLesson | null;
};

export function buildModulePath(
  module: CurriculumModule,
  getLesson: (slug: string) => Lesson | undefined,
  progress: ProfileProgress,
): ModulePath {
  const lessons: PathLesson[] = [];
  // The chain starts open: the first written lesson is available.
  let previousWrittenComplete = true;

  for (const entry of module.lessons) {
    const lesson = entry.slug === undefined ? undefined : getLesson(entry.slug);

    if (lesson === undefined) {
      // No content yet (or a draft this viewer may not see). Shown as being
      // written, and deliberately not part of the unlock chain.
      lessons.push({
        order: entry.order,
        title: entry.title,
        state: "unwritten",
      });
      continue;
    }

    const lessonEntry = progress[lesson.id];
    const complete = lessonEntry?.completion !== undefined;
    const resumableRun =
      lessonEntry?.run !== undefined &&
      lessonEntry.run.lessonVersion === lesson.version;

    let state: PathLessonState;
    if (complete) {
      state = "complete";
    } else if (!previousWrittenComplete) {
      state = "locked";
    } else if (resumableRun) {
      state = "in-progress";
    } else {
      state = "available";
    }

    const pathLesson: PathLesson = {
      order: entry.order,
      title: lesson.title,
      lesson,
      state,
    };
    if (lessonEntry?.completion !== undefined) {
      pathLesson.completedAt = lessonEntry.completion.completedAt;
    }
    if (lessonEntry?.missionStatus === "done") pathLesson.missionDone = true;

    lessons.push(pathLesson);
    previousWrittenComplete = complete;
  }

  const written = lessons.filter((lesson) => lesson.state !== "unwritten");
  const completedCount = written.filter(
    (lesson) => lesson.state === "complete",
  ).length;

  const resume =
    lessons.find((lesson) => lesson.state === "in-progress") ??
    lessons.find((lesson) => lesson.state === "available") ??
    null;

  return { lessons, completedCount, lessonCount: written.length, resume };
}
