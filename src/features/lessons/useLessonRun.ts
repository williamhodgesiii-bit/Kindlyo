"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { Lesson } from "@/features/curriculum/schema";
import {
  canAdvance as canAdvanceFrom,
  canGoBack as canGoBackFrom,
  createLessonReducer,
  getChoiceForStep,
  getCurrentStep,
  initialLessonRunState,
  isComplete as isCompleteFrom,
  toLessonProgress,
  type LessonRunState,
} from "./lessonMachine";
import {
  clearLessonRun,
  readLessonRun,
  recordCompletion,
  writeLessonRun,
} from "./progressStorage";
import { buildLessonSteps, getLastStep, type LessonStep } from "./steps";

/**
 * Binds the lesson reducer to a lesson, a child profile, and saved progress.
 *
 * Everything stored is keyed by `profileId`, so one child's run can never
 * resume into another child's session — the storage layer enforces the
 * scoping, and this hook simply never reads or writes without the id.
 *
 * Saved progress is read after mount, never during render: reading local
 * storage while rendering would make the server and client output disagree.
 * Until that read has happened `hydrated` is false and the page shows a
 * loading state, so a resumed lesson never flashes step one first.
 *
 * Reaching the completion step records a completion (with the lesson version,
 * a product rule) via `recordCompletion`, which keeps the first completion —
 * replaying never rewrites history.
 */

export type LessonRun = {
  lesson: Lesson;
  steps: readonly LessonStep[];
  step: LessonStep;
  state: LessonRunState;
  /** 1-based, for display. */
  stepNumber: number;
  stepCount: number;
  selectedChoiceId: string | undefined;
  canAdvance: boolean;
  canGoBack: boolean;
  isComplete: boolean;
  hydrated: boolean;
  choose: (choiceId: string) => void;
  practise: (optionId: string) => void;
  next: () => void;
  back: () => void;
  restart: () => void;
};

export function useLessonRun(lesson: Lesson, profileId: string): LessonRun {
  const steps = useMemo(() => buildLessonSteps(lesson), [lesson]);
  const reducer = useMemo(() => createLessonReducer(steps), [steps]);
  const [state, dispatch] = useReducer(reducer, initialLessonRunState);

  useEffect(() => {
    dispatch({
      type: "hydrate",
      progress: readLessonRun(profileId, lesson.id, lesson.version),
    });
  }, [profileId, lesson.id, lesson.version]);

  useEffect(() => {
    if (!state.hydrated) return;
    writeLessonRun(
      profileId,
      lesson.id,
      lesson.version,
      toLessonProgress(state),
    );
  }, [profileId, lesson.id, lesson.version, state]);

  // The completion record is written separately from the run so it survives
  // restarts and version bumps (see progressStorage.ts).
  useEffect(() => {
    if (!state.hydrated || state.completedAt === null) return;
    recordCompletion(profileId, lesson.id, lesson.version, state.completedAt);
  }, [profileId, lesson.id, lesson.version, state.hydrated, state.completedAt]);

  const choose = useCallback(
    (choiceId: string) => {
      const step = getCurrentStep(steps, state);
      if (step?.kind !== "choice") return;
      dispatch({ type: "choose", sceneId: step.scene.id, choiceId });
    },
    [state, steps],
  );

  const practise = useCallback((optionId: string) => {
    dispatch({ type: "practise", optionId });
  }, []);

  const next = useCallback(() => {
    dispatch({ type: "next", now: new Date().toISOString() });
  }, []);

  const back = useCallback(() => {
    dispatch({ type: "back" });
  }, []);

  const restart = useCallback(() => {
    // Clears the run only. A recorded completion stays: starting the story
    // again must not lock the lessons it had unlocked.
    clearLessonRun(profileId, lesson.id);
    dispatch({ type: "restart" });
  }, [profileId, lesson.id]);

  // The reducer clamps the index, so this fallback should be unreachable; it
  // exists so a bad restore can never render an empty screen.
  const step = getCurrentStep(steps, state) ?? getLastStep(steps);

  return {
    lesson,
    steps,
    step,
    state,
    stepNumber: state.stepIndex + 1,
    stepCount: steps.length,
    selectedChoiceId: getChoiceForStep(step, state),
    canAdvance: canAdvanceFrom(steps, state),
    canGoBack: canGoBackFrom(state),
    isComplete: isCompleteFrom(state),
    hydrated: state.hydrated,
    choose,
    practise,
    next,
    back,
    restart,
  };
}
