import { parseLesson } from "@/features/curriculum/validate";
import type { Lesson } from "@/features/curriculum/schema";
import { curriculumModules } from "@/content/modules";
import { introducingYourself } from "./introducing-yourself";
import { joiningAGroup } from "./joining-a-group";
import { leavingAConversation } from "./leaving-a-conversation";
import { listening } from "./listening";
import { meetingSomeoneNew } from "./meeting-someone-new";
import { reviewChallenge } from "./review-challenge";
import { sayingHello } from "./saying-hello";
import { usingNames } from "./using-names";
import { echoTreehouseLessons } from "./worlds/echo-treehouse";
import { friendshipForestLessons } from "./worlds/friendship-forest";
import { buildItWorkshopLessons } from "./worlds/build-it-workshop";
import { bridgeBuildersBayLessons } from "./worlds/bridge-builders-bay";
import { thankfulKitchenLessons } from "./worlds/thankful-kitchen";
import { welcomeHomeLessons } from "./worlds/welcome-home";
import { communityTownLessons } from "./worlds/community-town";
import { sunnyTableCafeLessons } from "./worlds/sunny-table-cafe";
import { pixelPlazaLessons } from "./worlds/pixel-plaza";
import { braveBasecampLessons } from "./worlds/brave-basecamp";
import { worldGardenLessons } from "./worlds/world-garden";

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
  // World 1 · Hello Garden — Meeting People.
  sayingHello,
  introducingYourself,
  usingNames,
  meetingSomeoneNew,
  joiningAGroup,
  listening,
  leavingAConversation,
  reviewChallenge,
  // Worlds 2–12 — one module each (docs/design/MODULE_WORLDS.md).
  ...echoTreehouseLessons,
  ...friendshipForestLessons,
  ...buildItWorkshopLessons,
  ...bridgeBuildersBayLessons,
  ...thankfulKitchenLessons,
  ...welcomeHomeLessons,
  ...communityTownLessons,
  ...sunnyTableCafeLessons,
  ...pixelPlazaLessons,
  ...braveBasecampLessons,
  ...worldGardenLessons,
];

// Lessons sort by their world's place on the map, then by their order within
// the module, so `lessons` reads module by module rather than interleaving
// every world's lesson one.
const moduleOrder = new Map(
  curriculumModules.map((module, index) => [module.id, index]),
);

export const lessons: readonly Lesson[] = authored
  .map(parseLesson)
  .sort(
    (a, b) =>
      (moduleOrder.get(a.moduleId) ?? 0) - (moduleOrder.get(b.moduleId) ?? 0) ||
      a.order - b.order,
  );

export const lessonsBySlug: ReadonlyMap<string, Lesson> = new Map(
  lessons.map((lesson) => [lesson.slug, lesson]),
);
