import type { Lesson } from "./schema";

/**
 * A minimal valid lesson, for tests.
 *
 * Engine tests use this rather than the real curriculum so that rewording a
 * sentence in `src/content` cannot turn a progression test red. Content itself
 * is covered separately, by the catalog tests and the end-to-end run.
 *
 * Lives in `src/` rather than a test folder because the path alias and the
 * strict-mode type checking are the same here; it is imported only by tests.
 */
export function makeTestLesson(overrides: Partial<Lesson> = {}): Lesson {
  return {
    id: "test-lesson",
    slug: "test-lesson",
    moduleId: "test-module",
    order: 1,
    title: "A test lesson",
    description: "A lesson used by the tests.",
    estimatedMinutes: 5,
    ageMin: 5,
    ageMax: 9,
    learningObjectives: ["Do the thing."],
    scenes: [
      {
        id: "opening",
        title: "The opening",
        narration: "Something happens.",
        illustrationKey: "test-scene",
      },
      {
        id: "decision",
        title: "The decision",
        narration: "Now you decide.",
        illustrationKey: "test-scene",
        prompt: "What could you do?",
        choices: [
          {
            id: "first",
            text: "Do the first thing",
            response: "Here is what tends to follow.",
            consequenceType: "helpful",
          },
          {
            id: "second",
            text: "Do the second thing",
            response: "This one could go either way.",
            consequenceType: "mixed",
          },
          {
            id: "third",
            text: "Do the third thing",
            response: "This one depends on the situation.",
            consequenceType: "needs_context",
          },
        ],
      },
    ],
    principle: {
      title: "The principle",
      body: "Why it helps another person.",
      points: ["It depends on the situation."],
    },
    practice: {
      prompt: "Your turn.",
      helperText: "There is no single right answer.",
      options: [
        {
          id: "practice-one",
          text: "The first way",
          encouragement: "That works.",
        },
        {
          id: "practice-two",
          text: "The second way",
          encouragement: "That works too.",
        },
      ],
      closing: "Try it once.",
    },
    offlineMission: {
      childPrompt: "Try it before the next lesson.",
      parentPrompt: "Give them one chance to try it.",
      completionQuestion: "What happened?",
    },
    parentCoaching: {
      title: "For the grown-up",
      prompt: "Model it once where they can see.",
      tryThis: ["Go first yourself."],
    },
    completion: {
      title: "You finished the test lesson",
      message: "Well practised.",
    },
    reviewQuestionIds: [],
    status: "draft",
    culturalNotes: ["Customs vary."],
    accessibilityNotes: ["No eye contact required."],
    safetyNotes: ["Safety comes before politeness."],
    version: 1,
    ...overrides,
  };
}
