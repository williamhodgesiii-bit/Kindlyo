import type { ContentStatus } from "@/features/curriculum/schema";

/**
 * The module outline.
 *
 * The eight lesson titles come from the approved MVP scope
 * (docs/MVP_SCOPE.md). Only entries carrying a `slug` have authored content;
 * the rest are listed so the learning path shows the shape of the module
 * without pretending the lessons exist.
 *
 * Draft content until reviewed by qualified humans (CLAUDE.md).
 */

export type ModuleLessonEntry = {
  order: number;
  title: string;
  /** Present once the lesson has authored content in `./lessons`. */
  slug?: string;
};

export type CurriculumModule = {
  id: string;
  title: string;
  description: string;
  status: ContentStatus;
  lessons: readonly ModuleLessonEntry[];
};

export const meetingPeopleModule: CurriculumModule = {
  id: "meeting-people",
  title: "Meeting People",
  description:
    "Eight short lessons about noticing other people, starting a conversation, and leaving one kindly.",
  status: "draft",
  lessons: [
    { order: 1, title: "Saying hello", slug: "saying-hello" },
    { order: 2, title: "Introducing yourself", slug: "introducing-yourself" },
    { order: 3, title: "Remembering and using names", slug: "using-names" },
    { order: 4, title: "Meeting someone new", slug: "meeting-someone-new" },
    { order: 5, title: "Joining a group", slug: "joining-a-group" },
    { order: 6, title: "Listening while someone speaks", slug: "listening" },
    {
      order: 7,
      title: "Leaving a conversation",
      slug: "leaving-a-conversation",
    },
    {
      order: 8,
      title: "Review and real-world challenge",
      slug: "review-challenge",
    },
  ],
};

export const curriculumModules: readonly CurriculumModule[] = [
  meetingPeopleModule,
];
