"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { getFamilyClient } from "@/features/families/familyClient";
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
  /**
   * When a valid mid-lesson run was found, the 0-based step it stopped on —
   * offered as a resume choice rather than resumed silently. `null` otherwise.
   */
  resumeStep: number | null;
  /** True when the saved run could not be loaded; a retry is offered. */
  loadError: boolean;
  choose: (choiceId: string) => void;
  practise: (optionId: string) => void;
  next: () => void;
  back: () => void;
  restart: () => void;
  /** Dismiss the resume prompt and continue from the saved step. */
  keepGoing: () => void;
  /** Clear the saved run and begin again from the first step. */
  startOver: () => void;
  /** Try loading the saved run again after a failure. */
  retry: () => void;
};

export function useLessonRun(lesson: Lesson, profileId: string): LessonRun {
  const steps = useMemo(() => buildLessonSteps(lesson), [lesson]);
  const reducer = useMemo(() => createLessonReducer(steps), [steps]);
  const [state, dispatch] = useReducer(reducer, initialLessonRunState);

  // A pending resume decision and a load failure are UI concerns beside the
  // machine, not part of the saved progress itself.
  const [resumeStep, setResumeStep] = useState<number | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    let active = true;
    getFamilyClient()
      .loadProgress(profileId)
      .then((progress) => {
        if (!active) return;
        // Version-strict, like the local store was: a run saved against a
        // different lesson version is discarded rather than resumed.
        const run = progress[lesson.id]?.run;
        const saved =
          run !== undefined && run.lessonVersion === lesson.version
            ? run.state
            : null;
        // Offer a resume choice for a run stopped mid-lesson; a fresh, finished,
        // or stale run just opens where it should, with nothing to decide.
        if (
          saved !== null &&
          saved.completedAt === null &&
          saved.stepIndex > 0
        ) {
          setResumeStep(Math.min(saved.stepIndex, steps.length - 1));
        }
        dispatch({ type: "hydrate", progress: saved });
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, [profileId, lesson.id, lesson.version, steps.length, reloadNonce]);

  useEffect(() => {
    if (!state.hydrated) return;
    void getFamilyClient().saveRun(
      profileId,
      lesson.id,
      lesson.version,
      toLessonProgress(state),
    );
  }, [profileId, lesson.id, lesson.version, state]);

  // The completion record is written separately from the run so it survives
  // restarts and version bumps (see the family store).
  useEffect(() => {
    if (!state.hydrated || state.completedAt === null) return;
    void getFamilyClient().recordCompletion(
      profileId,
      lesson.id,
      lesson.version,
      state.completedAt,
    );
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
    void getFamilyClient().clearRun(profileId, lesson.id);
    dispatch({ type: "restart" });
  }, [profileId, lesson.id]);

  const keepGoing = useCallback(() => setResumeStep(null), []);

  const startOver = useCallback(() => {
    void getFamilyClient().clearRun(profileId, lesson.id);
    dispatch({ type: "restart" });
    setResumeStep(null);
  }, [profileId, lesson.id]);

  const retry = useCallback(() => {
    setLoadError(false);
    setReloadNonce((nonce) => nonce + 1);
  }, []);

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
    resumeStep,
    loadError,
    choose,
    practise,
    next,
    back,
    restart,
    keepGoing,
    startOver,
    retry,
  };
}
