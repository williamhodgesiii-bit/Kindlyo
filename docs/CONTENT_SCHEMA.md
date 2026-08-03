# Content Schema

## Goal

Lessons should be stored as structured content rather than hardcoded inside UI
components.

## Proposed TypeScript model

```ts
export type ContentStatus = "draft" | "reviewed" | "published";

export type LessonChoice = {
  id: string;
  text: string;
  response: string;
  consequenceType: "helpful" | "mixed" | "needs_context";
};

export type LessonScene = {
  id: string;
  title: string;
  narration: string;
  illustrationKey: string;
  choices?: LessonChoice[];
};

export type OfflineMission = {
  childPrompt: string;
  parentPrompt: string;
  completionQuestion: string;
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
  principle: string;
  practicePrompt: string;
  offlineMission: OfflineMission;
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

## Rules

* UI components must render lesson data.
* UI components must not contain curriculum-specific logic.
* Lesson completion must record the lesson version.
* Published lesson content must be immutable.
* Revisions should create a new version.
* Draft lessons must not appear to normal users.
