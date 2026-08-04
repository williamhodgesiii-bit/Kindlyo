import { parseLesson } from "@/features/curriculum/validate";
import type { Lesson } from "@/features/curriculum/schema";
import { introducingYourself } from "./introducing-yourself";
import { joiningAGroup } from "./joining-a-group";
import { leavingAConversation } from "./leaving-a-conversation";
import { listening } from "./listening";
import { meetingSomeoneNew } from "./meeting-someone-new";
import { reviewChallenge } from "./review-challenge";
import { sayingHello } from "./saying-hello";
import { usingNames } from "./using-names";

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
const authored: readonly unknown[] = [
  sayingHello,
  introducingYourself,
  usingNames,
  meetingSomeoneNew,
  joiningAGroup,
  listening,
  leavingAConversation,
  reviewChallenge,
];

export const lessons: readonly Lesson[] = authored
  .map(parseLesson)
  .sort((a, b) => a.order - b.order);

export const lessonsBySlug: ReadonlyMap<string, Lesson> = new Map(
  lessons.map((lesson) => [lesson.slug, lesson]),
);
