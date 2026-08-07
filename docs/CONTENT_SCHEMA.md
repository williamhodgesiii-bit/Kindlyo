# Content Schema

## Goal

Lessons should be stored as structured content rather than hardcoded inside UI
components.

## The model

Implemented in `src/features/curriculum/schema.ts`, which is now the canonical
version. Lessons are authored in `src/content/lessons/`: Hello Garden's eight
are individual files there, and each of the other eleven neighborhood worlds is
one file under `src/content/lessons/worlds/` exporting that world's eight
lessons (decision 040). Every lesson is registered in `index.ts`, where it
passes through `parseLesson` at import.

The canonical `Lesson` type carries a required `skillArea` (a closed union;
decision 028) that the parent dashboard groups by — the summary below predates
it, so treat `schema.ts` as the source of truth where they differ.

```ts
export type ContentStatus = "draft" | "reviewed" | "published";

/** No "correct" member, and none may be added. */
export type ConsequenceType = "helpful" | "mixed" | "needs_context";

export type LessonChoice = {
  id: string;
  text: string;
  response: string;
  consequenceType: ConsequenceType;
};

export type LessonScene = {
  id: string;
  title: string;
  narration: string;
  /** A local drawing key, never a URL. */
  illustrationKey: string;
  /** Required when the scene offers choices. */
  prompt?: string;
  /** Two or more when present. */
  choices?: LessonChoice[];
};

export type LessonPrinciple = {
  title: string;
  body: string;
  /** Context, consent, and safety qualifiers. At least one. */
  points: string[];
};

export type PracticeOption = {
  id: string;
  text: string;
  encouragement: string;
};

export type LessonPractice = {
  prompt: string;
  helperText?: string;
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
  version: number;
};
```

Four fields differ from the first draft of this document, recorded as decision
017: `principle` and `practicePrompt` became objects (an explanation needs its
qualifiers; a rehearsal is an interaction, not a sentence), and `parentCoaching`
and `completion` were added so that copy can be specific to the skill rather
than generic UI text.

## Rules

- UI components must render lesson data.
- UI components must not contain curriculum-specific logic.
- Lesson completion must record the lesson version.
- Published lesson content must be immutable.
- Revisions should create a new version.
- Draft lessons must not appear to normal users.

## Validation

`src/features/curriculum/validate.ts` checks content at runtime, and runs over
every authored lesson when the registry is imported — so malformed content
fails the build rather than reaching a child's screen. It reports every problem
at once, each with a path.

Beyond shapes, it enforces the curriculum rules TypeScript cannot:

- A decision needs two or more options.
- A scene with choices needs a prompt.
- A lesson needs at least one scene with a decision.
- A principle needs at least one context point.
- Cultural, accessibility, and safety notes are required.
- `status` stays `draft` until `reviewedBy` and `reviewedAt` are both recorded.
- `illustrationKey` must be a local key, not a URL.

See `LESSON_ENGINE.md` for how content is turned into steps and played.
