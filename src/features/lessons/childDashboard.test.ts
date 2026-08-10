import { describe, expect, it } from "vitest";
import { meetingPeopleModule, talkingListeningModule } from "@/content/modules";
import { getLessonBySlug } from "@/features/curriculum/catalog";
import { buildChildDashboard, practiceStatusLabels } from "./childDashboard";
import type { ProfileProgress } from "./progressStorage";

/**
 * Built against the real Meeting People module, because the questions this
 * answers are about the real curriculum's shape — how many skill areas there
 * are, which lesson comes next. The dashboard now spans every world; passing a
 * single module keeps these unit tests focused on one world's figures, and the
 * aggregation across worlds has its own tests below.
 */
function build(progress: ProfileProgress) {
  return buildChildDashboard([meetingPeopleModule], getLessonBySlug, progress);
}

function completed(at: string) {
  return { completion: { lessonVersion: 1, completedAt: at }, updatedAt: at };
}

const AUG_4 = "2026-08-04T10:00:00.000Z";
const AUG_5 = "2026-08-05T10:00:00.000Z";
const AUG_6 = "2026-08-06T10:00:00.000Z";

// Read from the content so a lesson version bump doesn't strand these fixtures:
// an in-progress run only counts when it matches the current lesson version.
const SAYING_HELLO_VERSION = getLessonBySlug("saying-hello")?.version ?? 1;

describe("a child who has not started", () => {
  it("is empty", () => {
    const dashboard = build({});

    expect(dashboard.isEmpty).toBe(true);
    expect(dashboard.recent).toEqual([]);
    expect(dashboard.activeMission).toBeNull();
    expect(dashboard.talkingPoints).toEqual([]);
    expect(dashboard.lastActiveAt).toBeNull();
  });

  it("still points at the first lesson as what to practise next", () => {
    expect(build({}).resume?.entry.order).toBe(1);
  });

  it("lists every skill area as not started yet", () => {
    const dashboard = build({});

    expect(dashboard.skillAreas.length).toBeGreaterThan(0);
    for (const area of dashboard.skillAreas) {
      expect(area.status).toBe("not-started");
      expect(area.practisedCount).toBe(0);
    }
  });
});

describe("what has been practised", () => {
  it("counts finished lessons", () => {
    const dashboard = build({ "saying-hello": completed(AUG_4) });

    expect(dashboard.completedCount).toBe(1);
    expect(dashboard.isEmpty).toBe(false);
  });

  it("summarises the skill area the lesson belongs to", () => {
    const dashboard = build({ "saying-hello": completed(AUG_4) });
    const greeting = dashboard.skillAreas.find(
      (area) => area.area === "greeting",
    );

    // "Saying hello" is the only greeting lesson, so the area is now revisitable.
    expect(greeting?.status).toBe("ready-to-review");
    expect(greeting?.practisedCount).toBe(1);
  });

  it("marks a partly-practised area as practised, not finished", () => {
    // Two lessons share the "introducing" area; one of them is done.
    const dashboard = build({ "introducing-yourself": completed(AUG_4) });
    const introducing = dashboard.skillAreas.find(
      (area) => area.area === "introducing",
    );

    expect(introducing?.status).toBe("practised");
    expect(introducing?.practisedCount).toBe(1);
    expect(introducing?.lessonCount).toBe(2);
  });

  it("marks an area with only an unfinished lesson as exploring", () => {
    const dashboard = build({
      "saying-hello": {
        run: {
          lessonVersion: SAYING_HELLO_VERSION,
          state: {
            stepIndex: 2,
            choiceBySceneId: {},
            practiceOptionId: null,
            completedAt: null,
          },
        },
        updatedAt: AUG_4,
      },
    });

    expect(
      dashboard.skillAreas.find((area) => area.area === "greeting")?.status,
    ).toBe("exploring");
  });
});

describe("what to practise next", () => {
  it("points at the lesson unlocked by the last one", () => {
    expect(
      build({ "saying-hello": completed(AUG_4) }).resume?.entry.order,
    ).toBe(2);
  });

  it("has nothing left to suggest once the module is done", () => {
    const all: ProfileProgress = Object.fromEntries(
      meetingPeopleModule.lessons.flatMap((entry) =>
        entry.slug === undefined
          ? []
          : [[getLessonBySlug(entry.slug)?.id ?? "", completed(AUG_4)]],
      ),
    );

    expect(build(all).resume).toBeNull();
  });
});

describe("the active mission", () => {
  it("is the most recently finished lesson's", () => {
    const dashboard = build({
      "saying-hello": completed(AUG_4),
      "introducing-yourself": completed(AUG_6),
    });

    expect(dashboard.activeMission?.lesson.id).toBe("introducing-yourself");
    expect(dashboard.activeMission?.done).toBe(false);
  });

  it("carries the lesson's own question for afterwards", () => {
    const dashboard = build({ "saying-hello": completed(AUG_4) });
    const lesson = getLessonBySlug("saying-hello");

    expect(dashboard.activeMission?.conversationPrompt).toBe(
      lesson?.offlineMission.completionQuestion,
    );
  });

  it("reports when a parent has marked it done", () => {
    const dashboard = build({
      "saying-hello": { ...completed(AUG_4), missionStatus: "done" },
    });

    expect(dashboard.activeMission?.done).toBe(true);
  });

  it("is absent while nothing has been finished", () => {
    expect(build({}).activeMission).toBeNull();
  });
});

describe("recent activity", () => {
  it("lists the most recent first", () => {
    const dashboard = build({
      "saying-hello": completed(AUG_4),
      "introducing-yourself": completed(AUG_6),
      "using-names": completed(AUG_5),
    });

    expect(dashboard.recent.map((item) => item.lesson.id)).toEqual([
      "introducing-yourself",
      "using-names",
      "saying-hello",
    ]);
  });

  it("keeps the list short", () => {
    const progress: ProfileProgress = {
      "saying-hello": completed(AUG_4),
      "introducing-yourself": completed(AUG_5),
      "using-names": completed(AUG_6),
      "meeting-someone-new": completed("2026-08-07T10:00:00.000Z"),
    };

    expect(build(progress).recent).toHaveLength(3);
  });

  it("skips lessons the child has never opened", () => {
    expect(build({ "saying-hello": completed(AUG_4) }).recent).toHaveLength(1);
  });
});

describe("when the app was last used", () => {
  it("is the latest activity across every lesson", () => {
    const dashboard = build({
      "saying-hello": completed(AUG_4),
      "introducing-yourself": completed(AUG_6),
    });

    expect(dashboard.lastActiveAt).toBe(AUG_6);
  });

  it("counts an unfinished visit too", () => {
    const dashboard = build({
      "saying-hello": completed(AUG_4),
      "introducing-yourself": {
        run: {
          lessonVersion: 1,
          state: {
            stepIndex: 1,
            choiceBySceneId: {},
            practiceOptionId: null,
            completedAt: null,
          },
        },
        updatedAt: AUG_6,
      },
    });

    expect(dashboard.lastActiveAt).toBe(AUG_6);
  });
});

describe("things worth talking about", () => {
  /** Lesson one's "wait" choice is the needs_context (talking-point) option. */
  function chose(
    choiceId: string,
    lessonVersion = SAYING_HELLO_VERSION,
  ): ProfileProgress {
    return {
      "saying-hello": {
        ...completed(AUG_4),
        run: {
          lessonVersion,
          state: {
            stepIndex: 6,
            choiceBySceneId: { "the-first-moment": choiceId },
            practiceOptionId: "wave-hello",
            completedAt: AUG_4,
          },
        },
      },
    };
  }

  it("surfaces a choice whose outcome depends on the situation", () => {
    const points = build(chose("wait-to-be-greeted")).talkingPoints;

    expect(points).toHaveLength(1);
    expect(points[0]?.choiceText).toContain("Wait");
    expect(points[0]?.question).toBe("What could you do first?");
  });

  it("says nothing about a straightforwardly helpful choice", () => {
    expect(build(chose("say-hello-and-name")).talkingPoints).toEqual([]);
  });

  it("says nothing about the wave, which is a plain, affirmed hello", () => {
    // The wave is a "That helps" choice, equal to speaking — never flagged as a
    // thing to discuss. Only the situational "it depends" choice starts a chat.
    expect(build(chose("wave-instead")).talkingPoints).toEqual([]);
  });

  it("offers a question to ask, not a correction", () => {
    const lesson = getLessonBySlug("saying-hello");

    expect(
      build(chose("wait-to-be-greeted")).talkingPoints[0]?.conversationPrompt,
    ).toBe(lesson?.offlineMission.completionQuestion);
  });

  it("ignores choices recorded against different content", () => {
    // The scenes may have changed, so the question no longer matches.
    expect(build(chose("wait-to-be-greeted", 99)).talkingPoints).toEqual([]);
  });
});

describe("across the whole neighborhood", () => {
  /** Meeting People first, then Talking and Listening (Echo Treehouse). */
  function buildAll(progress: ProfileProgress) {
    return buildChildDashboard(
      [meetingPeopleModule, talkingListeningModule],
      getLessonBySlug,
      progress,
    );
  }

  it("keeps a world's progress separate but sums the totals", () => {
    const dashboard = buildAll({
      "saying-hello": completed(AUG_4),
      "echo-treehouse-whole-self-listening": completed(AUG_5),
    });

    expect(dashboard.completedCount).toBe(2);
    expect(dashboard.lessonCount).toBe(16);
    expect(dashboard.modules).toHaveLength(2);
    expect(dashboard.modules[0]?.path.completedCount).toBe(1);
    expect(dashboard.modules[1]?.path.completedCount).toBe(1);
  });

  it("resumes in the first world that still has something to do", () => {
    // Meeting People untouched, so the child is still there — not in world two.
    const dashboard = buildAll({
      "echo-treehouse-whole-self-listening": completed(AUG_5),
    });

    expect(dashboard.resume?.module.id).toBe(meetingPeopleModule.id);
    expect(dashboard.resume?.entry.order).toBe(1);
  });

  it("moves the resume on to the next world once one is finished", () => {
    const meetingPeopleDone: ProfileProgress = Object.fromEntries(
      meetingPeopleModule.lessons.flatMap((entry) =>
        entry.slug === undefined
          ? []
          : [[getLessonBySlug(entry.slug)?.id ?? "", completed(AUG_4)]],
      ),
    );

    const dashboard = buildAll(meetingPeopleDone);

    expect(dashboard.resume?.module.id).toBe(talkingListeningModule.id);
    expect(dashboard.resume?.entry.order).toBe(1);
  });

  it("takes the active mission from the most recent finish in any world", () => {
    const dashboard = buildAll({
      "saying-hello": completed(AUG_4),
      "echo-treehouse-whole-self-listening": completed(AUG_6),
    });

    expect(dashboard.activeMission?.lesson.id).toBe(
      "echo-treehouse-whole-self-listening",
    );
  });

  it("lists completed lessons from every world as reviewable", () => {
    const dashboard = buildAll({
      "saying-hello": completed(AUG_4),
      "echo-treehouse-whole-self-listening": completed(AUG_5),
    });

    const worlds = dashboard.reviewable.map(({ module }) => module.id);
    expect(worlds).toContain(meetingPeopleModule.id);
    expect(worlds).toContain(talkingListeningModule.id);
  });
});

describe("the vocabulary", () => {
  it("has no moral, grading, or ranking words in it", () => {
    const words = Object.values(practiceStatusLabels).join(" ").toLowerCase();

    for (const banned of [
      "good",
      "bad",
      "poor",
      "polite",
      "rude",
      "kind",
      "score",
      "grade",
      "rank",
      "behind",
      "fail",
      "pass",
    ]) {
      expect(words).not.toContain(banned);
    }
  });

  it("describes practice, using only the agreed labels", () => {
    expect(Object.values(practiceStatusLabels).sort()).toEqual([
      "Exploring",
      "Not started yet",
      "Practised",
      "Ready to review",
    ]);
  });
});
