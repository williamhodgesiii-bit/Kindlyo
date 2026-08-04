import { describe, expect, it } from "vitest";
import { makeTestLesson } from "@/features/curriculum/fixtures";
import { buildLessonSteps, getLastStep } from "./steps";

describe("buildLessonSteps", () => {
  it("follows the lesson structure: scenes, then explain, practise, mission, coaching, finish", () => {
    const steps = buildLessonSteps(makeTestLesson());

    expect(steps.map((step) => step.kind)).toEqual([
      "scene",
      "choice",
      "principle",
      "practice",
      "mission",
      "coaching",
      "completion",
    ]);
  });

  it("derives the scene steps from content rather than a fixed list", () => {
    const lesson = makeTestLesson();
    const extraScene = {
      id: "afterwards",
      title: "Afterwards",
      narration: "Later that morning.",
      illustrationKey: "test-scene",
    };
    const steps = buildLessonSteps({
      ...lesson,
      scenes: [...lesson.scenes, extraScene],
    });

    expect(steps.map((step) => step.kind).slice(0, 3)).toEqual([
      "scene",
      "choice",
      "scene",
    ]);
  });

  it("treats a scene with choices as a decision", () => {
    const steps = buildLessonSteps(makeTestLesson());
    const decision = steps.find((step) => step.kind === "choice");

    expect(decision?.scene.choices).toHaveLength(3);
  });

  it("gives every step a unique id", () => {
    const steps = buildLessonSteps(makeTestLesson());
    const ids = steps.map((step) => step.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("always ends with the completion step", () => {
    expect(getLastStep(buildLessonSteps(makeTestLesson())).kind).toBe(
      "completion",
    );
  });

  it("refuses to pretend an empty list has a last step", () => {
    expect(() => getLastStep([])).toThrow();
  });
});
