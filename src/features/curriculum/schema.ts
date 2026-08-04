/**
 * The curriculum content model.
 *
 * This is the shape every lesson in `src/content/` is authored against, and
 * the only thing the lesson engine knows about. UI components render this
 * data; they must never contain curriculum-specific branching
 * (docs/CONTENT_SCHEMA.md, "Rules").
 *
 * It follows the proposed model in docs/CONTENT_SCHEMA.md with three
 * deliberate extensions, recorded in docs/DECISIONS.md record 017:
 *
 * - `principle` is an object rather than a bare string, so the explanation can
 *   carry the context-and-safety points that docs/CURRICULUM_PRINCIPLES.md
 *   requires alongside the idea itself.
 * - `practicePrompt` becomes `practice`, because a rehearsal is an
 *   interaction, not a sentence.
 * - `parentCoaching` and `completion` are lesson-authored rather than generic
 *   UI copy, so the coaching advice can be specific to the skill.
 *
 * All content in this repository is draft content until reviewed by qualified
 * humans (CLAUDE.md, "Content status"). `status` is the record of that, and it
 * is surfaced in the interface rather than hidden in the data.
 */

/** Where a piece of content sits in the human review process. */
export type ContentStatus = "draft" | "reviewed" | "published";

/**
 * How a choice tends to land.
 *
 * There is no "correct" or "incorrect" member and none may be added:
 * docs/CURRICULUM_PRINCIPLES.md rules out moral scoring of a child's choice.
 * These describe the situation, not the learner.
 */
export type ConsequenceType = "helpful" | "mixed" | "needs_context";

export type LessonChoice = {
  id: string;
  /** What the child would do or say. */
  text: string;
  /** What tends to follow, told as an observation rather than a verdict. */
  response: string;
  consequenceType: ConsequenceType;
};

export type LessonScene = {
  id: string;
  title: string;
  narration: string;
  /**
   * Names a locally drawn illustration. Never a URL: illustrations are simple
   * local shapes, and no remote image is loaded anywhere in the lesson engine.
   */
  illustrationKey: string;
  /** The question put to the child. Required when the scene has choices. */
  prompt?: string;
  /** Two or more when present. A single "choice" is not a decision. */
  choices?: LessonChoice[];
};

export type LessonPrinciple = {
  title: string;
  /** Why the behaviour helps another person (CLAUDE.md, principle 2). */
  body: string;
  /**
   * The context, consent, and safety qualifiers. Every lesson carries at least
   * one, because etiquette is taught as situational rather than absolute.
   */
  points: string[];
};

export type PracticeOption = {
  id: string;
  text: string;
  /** Encouragement for choosing it. Never a score, never a correction. */
  encouragement: string;
};

export type LessonPractice = {
  prompt: string;
  helperText?: string;
  /** Two or more, all genuinely acceptable ways to do the thing. */
  options: PracticeOption[];
  closing: string;
};

export type OfflineMission = {
  childPrompt: string;
  parentPrompt: string;
  completionQuestion: string;
};

export type ParentCoaching = {
  title: string;
  prompt: string;
  /** Short, concrete, lightweight actions (CLAUDE.md, principle 8). */
  tryThis: string[];
};

export type LessonCompletion = {
  title: string;
  message: string;
};

export type Lesson = {
  id: string;
  slug: string;
  moduleId: string;
  order: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  ageMin: number;
  ageMax: number;
  learningObjectives: string[];
  scenes: LessonScene[];
  principle: LessonPrinciple;
  practice: LessonPractice;
  offlineMission: OfflineMission;
  parentCoaching: ParentCoaching;
  completion: LessonCompletion;
  reviewQuestionIds: string[];
  status: ContentStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  culturalNotes: string[];
  accessibilityNotes: string[];
  safetyNotes: string[];
  /**
   * Bumped whenever published content changes. Progress records the version it
   * was made against, so a revision never silently resumes into a different
   * lesson (docs/CONTENT_SCHEMA.md, "Rules").
   */
  version: number;
};

export const contentStatuses = [
  "draft",
  "reviewed",
  "published",
] as const satisfies readonly ContentStatus[];

export const consequenceTypes = [
  "helpful",
  "mixed",
  "needs_context",
] as const satisfies readonly ConsequenceType[];
