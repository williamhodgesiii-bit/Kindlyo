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
  clearLessonProgress,
  readLessonProgress,
  writeLessonProgress,
} from "./progressStorage";
import { buildLessonSteps, getLastStep, type LessonStep } from "./steps";

/**
 * Binds the lesson reducer to a lesson and to saved demo progress.
 *
 * Saved progress is read after mount, never during render: reading local
 * storage while rendering would make the server and client output disagree.
 * Until that read has happened `hydrated` is false and the page shows a
 * loading state, so a resumed lesson never flashes step one first.
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

export function useLessonRun(lesson: Lesson): LessonRun {
  const steps = useMemo(() => buildLessonSteps(lesson), [lesson]);
  const reducer = useMemo(() => createLessonReducer(steps), [steps]);
  const [state, dispatch] = useReducer(reducer, initialLessonRunState);

  useEffect(() => {
    dispatch({
      type: "hydrate",
      progress: readLessonProgress(lesson.id, lesson.version),
    });
  }, [lesson.id, lesson.version]);

  useEffect(() => {
    if (!state.hydrated) return;
    writeLessonProgress(lesson.id, lesson.version, toLessonProgress(state));
  }, [lesson.id, lesson.version, state]);

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
    clearLessonProgress(lesson.id);
    dispatch({ type: "restart" });
  }, [lesson.id]);

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
