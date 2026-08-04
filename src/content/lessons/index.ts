import { parseLesson } from "@/features/curriculum/validate";
import type { Lesson } from "@/features/curriculum/schema";
import { sayingHello } from "./saying-hello";

/**
 * The authored lesson registry.
 *
 * Every lesson is validated here, at module load. Because this module is
 * imported by the pages that render lessons, malformed content fails
 * `next build` rather than reaching a child's screen — no separate content
 * build step needed (docs/DECISIONS.md record 018).
 *
 * TypeScript alone is not enough: it checks the shape at the point of
 * authoring, not the curriculum rules (a decision needs two or more options, a
 * principle needs a context point, reviewed content needs a named reviewer),
 * and it would not catch content arriving from a CMS later.
 */
const authored: readonly unknown[] = [sayingHello];

export const lessons: readonly Lesson[] = authored
  .map(parseLesson)
  .sort((a, b) => a.order - b.order);

export const lessonsBySlug: ReadonlyMap<string, Lesson> = new Map(
  lessons.map((lesson) => [lesson.slug, lesson]),
);
