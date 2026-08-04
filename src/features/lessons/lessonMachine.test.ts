import { describe, expect, it } from "vitest";
import { makeTestLesson } from "@/features/curriculum/fixtures";
import {
  canAdvance,
  canGoBack,
  createLessonReducer,
  getCurrentStep,
  initialLessonRunState,
  isComplete,
  normalizeLessonProgress,
  type LessonAction,
  type LessonProgress,
  type LessonRunState,
} from "./lessonMachine";
import { buildLessonSteps } from "./steps";

const steps = buildLessonSteps(makeTestLesson());
const reduce = createLessonReducer(steps);

const NOW = "2026-08-04T10:00:00.000Z";

function run(actions: readonly LessonAction[]): LessonRunState {
  return actions.reduce(reduce, initialLessonRunState);
}

const next: LessonAction = { type: "next", now: NOW };

describe("progression", () => {
  it("starts on the first step", () => {
    expect(initialLessonRunState.stepIndex).toBe(0);
    expect(getCurrentStep(steps, initialLessonRunState)?.kind).toBe("scene");
  });

  it("moves forward one step at a time", () => {
    const state = run([next]);

    expect(getCurrentStep(steps, state)?.kind).toBe("choice");
  });

  it("will not leave a decision until a choice has been made", () => {
    const atDecision = run([next]);
    expect(canAdvance(steps, atDecision)).toBe(false);

    const stillThere = reduce(atDecision, next);
    expect(stillThere.stepIndex).toBe(atDecision.stepIndex);

    const answered = reduce(atDecision, {
      type: "choose",
      sceneId: "decision",
      choiceId: "second",
    });
    expect(canAdvance(steps, answered)).toBe(true);
    expect(getCurrentStep(steps, reduce(answered, next))?.kind).toBe(
      "principle",
    );
  });

  it("will not leave the practice step until an option has been picked", () => {
    const atPractice = run([
      next,
      { type: "choose", sceneId: "decision", choiceId: "first" },
      next,
      next,
    ]);
    expect(getCurrentStep(steps, atPractice)?.kind).toBe("practice");
    expect(canAdvance(steps, atPractice)).toBe(false);

    const practised = reduce(atPractice, {
      type: "practise",
      optionId: "practice-two",
    });
    expect(canAdvance(steps, practised)).toBe(true);
  });

  it("goes back without losing what was chosen", () => {
    const afterDecision = run([
      next,
      { type: "choose", sceneId: "decision", choiceId: "third" },
      next,
    ]);

    const back = reduce(afterDecision, { type: "back" });

    expect(getCurrentStep(steps, back)?.kind).toBe("choice");
    expect(back.choiceBySceneId).toEqual({ decision: "third" });
  });

  it("cannot go back from the first step", () => {
    expect(canGoBack(initialLessonRunState)).toBe(false);
    expect(reduce(initialLessonRunState, { type: "back" })).toBe(
      initialLessonRunState,
    );
  });

  it("stops at the completion step", () => {
    const finished = run([
      next,
      { type: "choose", sceneId: "decision", choiceId: "first" },
      next,
      next,
      { type: "practise", optionId: "practice-one" },
      next,
      next,
      next,
    ]);

    expect(getCurrentStep(steps, finished)?.kind).toBe("completion");
    expect(canAdvance(steps, finished)).toBe(false);
    expect(reduce(finished, next).stepIndex).toBe(finished.stepIndex);
  });

  it("records completion once, when the completion step is reached", () => {
    const finished = run([
      next,
      { type: "choose", sceneId: "decision", choiceId: "first" },
      next,
      next,
      { type: "practise", optionId: "practice-one" },
      next,
      next,
      next,
    ]);

    expect(isComplete(finished)).toBe(true);
    expect(finished.completedAt).toBe(NOW);

    // Going back and forward again must not rewrite the completion time.
    const again = reduce(reduce(finished, { type: "back" }), {
      type: "next",
      now: "2026-08-05T10:00:00.000Z",
    });
    expect(again.completedAt).toBe(NOW);
  });

  it("is not complete before the end", () => {
    expect(isComplete(run([next]))).toBe(false);
  });

  it("starts over on restart", () => {
    const started = run([
      next,
      { type: "choose", sceneId: "decision", choiceId: "first" },
    ]);

    expect(reduce(started, { type: "restart" })).toEqual(initialLessonRunState);
  });
});

describe("choices", () => {
  it("records the choice made on the step in view", () => {
    const state = run([
      next,
      { type: "choose", sceneId: "decision", choiceId: "second" },
    ]);

    expect(state.choiceBySceneId).toEqual({ decision: "second" });
  });

  it("lets a child change their mind while the step is on screen", () => {
    const state = run([
      next,
      { type: "choose", sceneId: "decision", choiceId: "second" },
      { type: "choose", sceneId: "decision", choiceId: "third" },
    ]);

    expect(state.choiceBySceneId).toEqual({ decision: "third" });
  });

  it("ignores a choice for a scene that is not on screen", () => {
    const state = reduce(initialLessonRunState, {
      type: "choose",
      sceneId: "decision",
      choiceId: "first",
    });

    expect(state).toBe(initialLessonRunState);
  });

  it("ignores a choice id that does not belong to the scene", () => {
    const atDecision = run([next]);
    const state = reduce(atDecision, {
      type: "choose",
      sceneId: "decision",
      choiceId: "invented",
    });

    expect(state).toBe(atDecision);
  });

  it("ignores a practice option that does not exist", () => {
    const atPractice = run([
      next,
      { type: "choose", sceneId: "decision", choiceId: "first" },
      next,
      next,
    ]);

    expect(reduce(atPractice, { type: "practise", optionId: "made-up" })).toBe(
      atPractice,
    );
  });
});

describe("restoring saved progress", () => {
  const saved: LessonProgress = {
    stepIndex: 3,
    choiceBySceneId: { decision: "second" },
    practiceOptionId: "practice-one",
    completedAt: null,
  };

  it("starts unhydrated, so nothing renders before saved progress is looked for", () => {
    expect(initialLessonRunState.hydrated).toBe(false);
  });

  it("restores progress that matches the lesson", () => {
    const state = reduce(initialLessonRunState, {
      type: "hydrate",
      progress: saved,
    });

    expect(state).toEqual({ ...saved, hydrated: true });
  });

  it("marks itself hydrated even when there is nothing saved", () => {
    const state = reduce(initialLessonRunState, {
      type: "hydrate",
      progress: null,
    });

    expect(state).toEqual({ ...initialLessonRunState, hydrated: true });
  });

  it("ignores a second hydration, so a remount cannot rewind a run", () => {
    const hydrated = reduce(initialLessonRunState, {
      type: "hydrate",
      progress: saved,
    });
    const moved = reduce(hydrated, next);

    expect(reduce(moved, { type: "hydrate", progress: saved })).toBe(moved);
  });

  it("stays hydrated after a restart", () => {
    const hydrated = reduce(initialLessonRunState, {
      type: "hydrate",
      progress: saved,
    });

    expect(reduce(hydrated, { type: "restart" })).toEqual({
      ...initialLessonRunState,
      hydrated: true,
    });
  });

  it("clamps a step index beyond the end of the lesson", () => {
    const restored = normalizeLessonProgress(steps, {
      ...saved,
      stepIndex: 99,
    });

    expect(restored.stepIndex).toBe(steps.length - 1);
  });

  it("clamps a negative step index", () => {
    expect(
      normalizeLessonProgress(steps, { ...saved, stepIndex: -4 }).stepIndex,
    ).toBe(0);
  });

  it("drops choices and options that no longer exist in the content", () => {
    const restored = normalizeLessonProgress(steps, {
      stepIndex: 1,
      choiceBySceneId: { decision: "removed", ghost: "first" },
      practiceOptionId: "removed",
      completedAt: null,
    });

    expect(restored.choiceBySceneId).toEqual({});
    expect(restored.practiceOptionId).toBeNull();
  });
});
