import { describe, expect, it } from "vitest";
import type { CurriculumModule } from "@/content/modules";
import { makeTestLesson } from "@/features/curriculum/fixtures";
import type { Lesson } from "@/features/curriculum/schema";
import { buildModulePath } from "./moduleProgress";
import type { ProfileProgress } from "./progressStorage";

/**
 * A three-lesson module, so the unlock chain has a middle as well as ends.
 * Built from fixtures rather than the real curriculum: rewording a lesson must
 * not turn a progression test red.
 */
const lessons: Lesson[] = [1, 2, 3].map((order) =>
  makeTestLesson({
    id: `lesson-${order}`,
    slug: `lesson-${order}`,
    order,
    title: `Lesson ${order}`,
  }),
);

const testModule: CurriculumModule = {
  id: "test-module",
  title: "Test module",
  description: "Three lessons.",
  status: "draft",
  lessons: lessons.map((lesson) => ({
    order: lesson.order,
    title: lesson.title,
    slug: lesson.slug,
  })),
};

const getLesson = (slug: string) =>
  lessons.find((lesson) => lesson.slug === slug);

function completed(at = "2026-08-04T10:00:00.000Z") {
  return { completion: { lessonVersion: 1, completedAt: at } };
}

function build(progress: ProfileProgress) {
  return buildModulePath(testModule, getLesson, progress);
}

function states(progress: ProfileProgress) {
  return build(progress).lessons.map((entry) => entry.state);
}

describe("the unlock chain", () => {
  it("opens the first lesson and locks the rest for a new child", () => {
    expect(states({})).toEqual(["available", "locked", "locked"]);
  });

  it("unlocks the next lesson when one is completed", () => {
    expect(states({ "lesson-1": completed() })).toEqual([
      "complete",
      "available",
      "locked",
    ]);
  });

  it("unlocks one lesson at a time, not all of them", () => {
    expect(
      states({ "lesson-1": completed(), "lesson-2": completed() }),
    ).toEqual(["complete", "complete", "available"]);
  });

  it("does not unlock a later lesson from a mid-lesson run alone", () => {
    const progress: ProfileProgress = {
      "lesson-1": {
        run: {
          lessonVersion: 1,
          state: {
            stepIndex: 3,
            choiceBySceneId: {},
            practiceOptionId: null,
            completedAt: null,
          },
        },
      },
    };

    expect(states(progress)).toEqual(["in-progress", "locked", "locked"]);
  });

  it("keeps a finished lesson open to be played again", () => {
    const path = build({ "lesson-1": completed() });
    const first = path.lessons[0];

    expect(first?.state).toBe("complete");
    expect(first?.lesson).toBeDefined();
  });
});

describe("in-progress detection", () => {
  const run = {
    lessonVersion: 1,
    state: {
      stepIndex: 2,
      choiceBySceneId: {},
      practiceOptionId: null,
      completedAt: null,
    },
  };

  it("marks a lesson with a saved run as in progress", () => {
    expect(states({ "lesson-1": { run } })[0]).toBe("in-progress");
  });

  it("ignores a run saved against a different lesson version", () => {
    const stale = { ...run, lessonVersion: 99 };

    expect(states({ "lesson-1": { run: stale } })[0]).toBe("available");
  });

  it("lets complete beat in-progress when a finished lesson is replayed", () => {
    expect(states({ "lesson-1": { run, ...completed() } })[0]).toBe("complete");
  });
});

describe("module progress", () => {
  it("counts finished lessons out of the written ones", () => {
    const path = build({ "lesson-1": completed() });

    expect(path.completedCount).toBe(1);
    expect(path.lessonCount).toBe(3);
  });

  it("starts at zero for a new child", () => {
    expect(build({}).completedCount).toBe(0);
  });

  it("reports the completion timestamp and mission status", () => {
    const path = build({
      "lesson-1": {
        ...completed("2026-08-04T10:00:00.000Z"),
        missionStatus: "done",
      },
    });

    expect(path.lessons[0]?.completedAt).toBe("2026-08-04T10:00:00.000Z");
    expect(path.lessons[0]?.missionDone).toBe(true);
  });

  it("leaves mission status undefined until a parent marks it", () => {
    expect(
      build({ "lesson-1": completed() }).lessons[0]?.missionDone,
    ).toBeUndefined();
  });
});

describe("resuming", () => {
  it("points at the first lesson for a new child", () => {
    expect(build({}).resume?.order).toBe(1);
  });

  it("prefers the lesson already in progress", () => {
    const progress: ProfileProgress = {
      "lesson-1": completed(),
      "lesson-2": {
        run: {
          lessonVersion: 1,
          state: {
            stepIndex: 1,
            choiceBySceneId: {},
            practiceOptionId: null,
            completedAt: null,
          },
        },
      },
    };

    expect(build(progress).resume?.order).toBe(2);
    expect(build(progress).resume?.state).toBe("in-progress");
  });

  it("points at the next available lesson when nothing is part-done", () => {
    expect(build({ "lesson-1": completed() }).resume?.order).toBe(2);
  });

  it("has nowhere left to resume once the module is finished", () => {
    const all: ProfileProgress = {
      "lesson-1": completed(),
      "lesson-2": completed(),
      "lesson-3": completed(),
    };

    expect(build(all).resume).toBeNull();
    expect(build(all).completedCount).toBe(3);
  });
});

describe("lessons that are not written yet", () => {
  const partialModule: CurriculumModule = {
    ...testModule,
    lessons: [
      { order: 1, title: "Lesson 1", slug: "lesson-1" },
      { order: 2, title: "Not written" },
      { order: 3, title: "Lesson 3", slug: "lesson-3" },
    ],
  };

  it("shows them as being written rather than locked", () => {
    const path = buildModulePath(partialModule, getLesson, {});

    expect(path.lessons.map((entry) => entry.state)).toEqual([
      "available",
      "unwritten",
      "locked",
    ]);
  });

  it("does not count them towards the module total", () => {
    expect(buildModulePath(partialModule, getLesson, {}).lessonCount).toBe(2);
  });

  it("does not let our authoring backlog block a child", () => {
    // Finishing lesson 1 opens lesson 3, even though lesson 2 has no content.
    const path = buildModulePath(partialModule, getLesson, {
      "lesson-1": completed(),
    });

    expect(path.lessons[2]?.state).toBe("available");
  });
});

describe("failing safely", () => {
  it("ignores progress for lessons that are not in this module", () => {
    expect(states({ "some-other-lesson": completed() })).toEqual([
      "available",
      "locked",
      "locked",
    ]);
  });

  it("treats a lesson the viewer cannot see as unwritten", () => {
    const path = buildModulePath(testModule, () => undefined, {});

    expect(path.lessons.every((entry) => entry.state === "unwritten")).toBe(
      true,
    );
    expect(path.lessonCount).toBe(0);
    expect(path.resume).toBeNull();
  });
});
