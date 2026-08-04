import { lessons, lessonsBySlug } from "@/content/lessons";
import { curriculumModules, type CurriculumModule } from "@/content/modules";
import type { Lesson } from "./schema";

/**
 * Read access to the curriculum.
 *
 * Pages ask this module for lessons; they never import `src/content`
 * directly. That keeps the visibility rule in one place instead of repeated at
 * every call site.
 */

/**
 * Whether draft content may be shown.
 *
 * docs/CONTENT_SCHEMA.md requires that draft lessons not appear to normal
 * users. There is no user yet — accounts arrive in a later slice — and every
 * authored lesson is currently draft, so the pre-auth answer is yes, with the
 * status shown on screen wherever a lesson appears (CLAUDE.md, "Content
 * status": use visible internal metadata).
 *
 * This is the single place that changes when accounts exist: it becomes a role
 * check, and normal users stop seeing drafts.
 */
export function canViewDraftContent(): boolean {
  return true;
}

export function isLessonVisible(
  lesson: Lesson,
  canViewDrafts: boolean = canViewDraftContent(),
): boolean {
  return lesson.status !== "draft" || canViewDrafts;
}

export function listLessons(
  canViewDrafts: boolean = canViewDraftContent(),
): readonly Lesson[] {
  return lessons.filter((lesson) => isLessonVisible(lesson, canViewDrafts));
}

/** Returns undefined for an unknown slug and for a hidden draft alike. */
export function getLessonBySlug(
  slug: string,
  canViewDrafts: boolean = canViewDraftContent(),
): Lesson | undefined {
  const lesson = lessonsBySlug.get(slug);
  if (lesson === undefined) return undefined;
  return isLessonVisible(lesson, canViewDrafts) ? lesson : undefined;
}

export function listModules(): readonly CurriculumModule[] {
  return curriculumModules;
}
