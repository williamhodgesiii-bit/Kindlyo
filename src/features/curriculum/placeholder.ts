/**
 * Placeholder curriculum data for the application shell.
 *
 * This is NOT curriculum. It exists only so the placeholder routes can render
 * realistic structure before the lesson engine is built. Real content will
 * follow the model in docs/CONTENT_SCHEMA.md and must be authored against
 * docs/CURRICULUM_PRINCIPLES.md.
 *
 * All content in this repository is draft content until reviewed by qualified
 * humans (see CLAUDE.md, "Content status").
 */

export type PlaceholderLesson = {
  order: number;
  title: string;
};

export type PlaceholderModule = {
  title: string;
  /** Draft until reviewed by qualified humans. */
  status: "draft";
  lessons: readonly PlaceholderLesson[];
};

/** Titles come from the approved MVP scope; no lesson bodies are written yet. */
export const placeholderModule: PlaceholderModule = {
  title: "Meeting People",
  status: "draft",
  lessons: [
    { order: 1, title: "Saying hello" },
    { order: 2, title: "Introducing yourself" },
    { order: 3, title: "Remembering and using names" },
    { order: 4, title: "Meeting someone new" },
    { order: 5, title: "Joining a group" },
    { order: 6, title: "Listening while someone speaks" },
    { order: 7, title: "Leaving a conversation" },
    { order: 8, title: "Review and real-world challenge" },
  ],
};
