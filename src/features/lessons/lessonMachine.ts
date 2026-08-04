import type { LessonStep } from "./steps";

/**
 * Lesson progression, as a pure reducer.
 *
 * All the progression rules live here rather than inside a component, so they
 * can be tested without rendering anything and so no page can accidentally
 * invent a different rule (docs/ARCHITECTURE.md, "Boundaries").
 *
 * The rules:
 *
 * - A decision step will not advance until a choice has been made. Feedback is
 *   the point of the step; skipping past it would skip the lesson.
 * - The practice step will not advance until an option has been picked.
 * - Going back is always allowed, and never erases what was chosen. A child who
 *   wants to re-read the story should not lose their place.
 * - A choice may be changed while its step is on screen. Trying another one and
 *   reading what happens is learning, not cheating.
 * - The completion step is terminal; `next` does nothing there.
 *
 * `completedAt` is set when the completion step is reached. The caller supplies
 * the timestamp so the reducer stays pure and testable.
 */

/** The part of a run that is worth saving. */
export type LessonProgress = {
  stepIndex: number;
  /** sceneId -> choiceId, for every decision made so far. */
  choiceBySceneId: Readonly<Record<string, string>>;
  practiceOptionId: string | null;
  /** ISO timestamp, set once the completion step is reached. */
  completedAt: string | null;
};

/**
 * Progress, plus whether saved progress has been looked for yet.
 *
 * `hydrated` lives in the machine rather than in a `useState` beside it so
 * that restoring saved progress is a single transition rather than two state
 * updates racing each other on mount.
 */
export type LessonRunState = LessonProgress & { hydrated: boolean };

export type LessonAction =
  | { type: "choose"; sceneId: string; choiceId: string }
  | { type: "practise"; optionId: string }
  | { type: "next"; now: string }
  | { type: "back" }
  | { type: "restart" }
  | { type: "hydrate"; progress: LessonProgress | null };

export const emptyLessonProgress: LessonProgress = {
  stepIndex: 0,
  choiceBySceneId: {},
  practiceOptionId: null,
  completedAt: null,
};

export const initialLessonRunState: LessonRunState = {
  ...emptyLessonProgress,
  hydrated: false,
};

/** The subset of a run that is written to storage. */
export function toLessonProgress(state: LessonRunState): LessonProgress {
  return {
    stepIndex: state.stepIndex,
    choiceBySceneId: state.choiceBySceneId,
    practiceOptionId: state.practiceOptionId,
    completedAt: state.completedAt,
  };
}

export function getStep(
  steps: readonly LessonStep[],
  index: number,
): LessonStep | undefined {
  return steps[index];
}

export function getCurrentStep(
  steps: readonly LessonStep[],
  state: LessonRunState,
): LessonStep | undefined {
  return getStep(steps, state.stepIndex);
}

/** The choice made on a decision step, if any. */
export function getChoiceForStep(
  step: LessonStep,
  state: LessonRunState,
): string | undefined {
  if (step.kind !== "choice") return undefined;
  return state.choiceBySceneId[step.scene.id];
}

/**
 * Whether the current step is finished enough to move on.
 *
 * Story, principle, mission, and coaching steps are read-only, so they are
 * always ready. Decision and practice steps need an answer first.
 */
export function canAdvance(
  steps: readonly LessonStep[],
  state: LessonRunState,
): boolean {
  const step = getCurrentStep(steps, state);
  if (step === undefined) return false;
  if (state.stepIndex >= steps.length - 1) return false;

  switch (step.kind) {
    case "choice":
      return getChoiceForStep(step, state) !== undefined;
    case "practice":
      return state.practiceOptionId !== null;
    default:
      return true;
  }
}

export function canGoBack(state: LessonRunState): boolean {
  return state.stepIndex > 0;
}

export function isComplete(state: LessonRunState): boolean {
  return state.completedAt !== null;
}

/**
 * Clamps restored state to a lesson's actual steps.
 *
 * Stored progress is untrusted input: it comes from local storage, which the
 * user can edit and which may have been written by an older build.
 */
export function normalizeLessonProgress(
  steps: readonly LessonStep[],
  progress: LessonProgress,
): LessonProgress {
  const lastIndex = Math.max(steps.length - 1, 0);
  const stepIndex = Number.isInteger(progress.stepIndex)
    ? Math.min(Math.max(progress.stepIndex, 0), lastIndex)
    : 0;

  const choiceBySceneId: Record<string, string> = {};
  for (const step of steps) {
    if (step.kind !== "choice") continue;
    const chosen = progress.choiceBySceneId[step.scene.id];
    if (
      chosen !== undefined &&
      step.scene.choices.some((choice) => choice.id === chosen)
    ) {
      choiceBySceneId[step.scene.id] = chosen;
    }
  }

  const practiceStep = steps.find((step) => step.kind === "practice");
  const practiceOptionId =
    practiceStep !== undefined &&
    progress.practiceOptionId !== null &&
    practiceStep.practice.options.some(
      (option) => option.id === progress.practiceOptionId,
    )
      ? progress.practiceOptionId
      : null;

  return {
    stepIndex,
    choiceBySceneId,
    practiceOptionId,
    completedAt: progress.completedAt,
  };
}

export function createLessonReducer(steps: readonly LessonStep[]) {
  return function lessonReducer(
    state: LessonRunState,
    action: LessonAction,
  ): LessonRunState {
    switch (action.type) {
      case "choose": {
        const step = getCurrentStep(steps, state);
        // Only the decision currently on screen may be answered, and only with
        // one of its own options.
        if (step?.kind !== "choice") return state;
        if (step.scene.id !== action.sceneId) return state;
        if (!step.scene.choices.some((choice) => choice.id === action.choiceId))
          return state;
        if (state.choiceBySceneId[action.sceneId] === action.choiceId)
          return state;

        return {
          ...state,
          choiceBySceneId: {
            ...state.choiceBySceneId,
            [action.sceneId]: action.choiceId,
          },
        };
      }

      case "practise": {
        const step = getCurrentStep(steps, state);
        if (step?.kind !== "practice") return state;
        if (
          !step.practice.options.some((option) => option.id === action.optionId)
        )
          return state;
        if (state.practiceOptionId === action.optionId) return state;

        return { ...state, practiceOptionId: action.optionId };
      }

      case "next": {
        if (!canAdvance(steps, state)) return state;
        const stepIndex = state.stepIndex + 1;
        const arrived = getStep(steps, stepIndex);
        const completedAt =
          arrived?.kind === "completion" && state.completedAt === null
            ? action.now
            : state.completedAt;

        return { ...state, stepIndex, completedAt };
      }

      case "back": {
        if (!canGoBack(state)) return state;
        return { ...state, stepIndex: state.stepIndex - 1 };
      }

      case "restart":
        return { ...emptyLessonProgress, hydrated: state.hydrated };

      case "hydrate": {
        if (state.hydrated) return state;
        if (action.progress === null) return { ...state, hydrated: true };
        return {
          ...normalizeLessonProgress(steps, action.progress),
          hydrated: true,
        };
      }

      default:
        return state;
    }
  };
}
