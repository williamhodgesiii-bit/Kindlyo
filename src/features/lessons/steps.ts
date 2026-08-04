import type {
  Lesson,
  LessonChoice,
  LessonCompletion,
  LessonPractice,
  LessonPrinciple,
  LessonScene,
  OfflineMission,
  ParentCoaching,
} from "@/features/curriculum/schema";

/**
 * Turning a lesson into a sequence of steps.
 *
 * The order is the lesson structure from docs/CURRICULUM_PRINCIPLES.md —
 * situation, decision, outcome, explanation, guided practice, real-world
 * mission, parent coaching — plus a completion screen at the end.
 *
 * It is derived from content, never hardcoded per lesson: a lesson with three
 * story scenes and two decisions produces the steps for that lesson without
 * anyone touching this file. The renderer switches on `kind`, so no UI
 * component needs to know which lesson it is showing.
 */

/** A scene that asks the child to decide. */
export type ChoiceScene = LessonScene & { choices: LessonChoice[] };

export type LessonStep =
  | { kind: "scene"; id: string; title: string; scene: LessonScene }
  | { kind: "choice"; id: string; title: string; scene: ChoiceScene }
  | { kind: "principle"; id: string; title: string; principle: LessonPrinciple }
  | { kind: "practice"; id: string; title: string; practice: LessonPractice }
  | { kind: "mission"; id: string; title: string; mission: OfflineMission }
  | { kind: "coaching"; id: string; title: string; coaching: ParentCoaching }
  | {
      kind: "completion";
      id: string;
      title: string;
      completion: LessonCompletion;
    };

export type LessonStepKind = LessonStep["kind"];

function hasChoices(scene: LessonScene): scene is ChoiceScene {
  return scene.choices !== undefined && scene.choices.length > 0;
}

/**
 * The final step of a lesson.
 *
 * `buildLessonSteps` always appends a completion step, so a step list is never
 * empty; this states that once instead of scattering non-null assertions.
 */
export function getLastStep(steps: readonly LessonStep[]): LessonStep {
  const last = steps[steps.length - 1];
  if (last === undefined) {
    throw new Error("A lesson step list always ends with a completion step.");
  }
  return last;
}

export function buildLessonSteps(lesson: Lesson): readonly LessonStep[] {
  const sceneSteps = lesson.scenes.map((scene): LessonStep =>
    hasChoices(scene)
      ? { kind: "choice", id: `choice-${scene.id}`, title: scene.title, scene }
      : { kind: "scene", id: `scene-${scene.id}`, title: scene.title, scene },
  );

  return [
    ...sceneSteps,
    {
      kind: "principle",
      id: "principle",
      title: lesson.principle.title,
      principle: lesson.principle,
    },
    {
      kind: "practice",
      id: "practice",
      title: "Your turn to practise",
      practice: lesson.practice,
    },
    {
      kind: "mission",
      id: "mission",
      title: "Your mission away from the screen",
      mission: lesson.offlineMission,
    },
    {
      kind: "coaching",
      id: "coaching",
      title: lesson.parentCoaching.title,
      coaching: lesson.parentCoaching,
    },
    {
      kind: "completion",
      id: "completion",
      title: lesson.completion.title,
      completion: lesson.completion,
    },
  ];
}
