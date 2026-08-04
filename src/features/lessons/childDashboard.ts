import type { CurriculumModule } from "@/content/modules";
import type { Lesson, SkillArea } from "@/features/curriculum/schema";
import { skillAreas } from "@/features/curriculum/schema";
import {
  buildModulePath,
  type ModulePath,
  type PathLesson,
} from "./moduleProgress";
import type { ProfileProgress } from "./progressStorage";

/**
 * Everything the parent dashboard shows about one child, derived in one pure
 * place so the screen only has to lay it out.
 *
 * It answers five questions, and deliberately no others:
 *
 * 1. What has my child practised?      → `path`, `skillAreas`
 * 2. What should we practise next?     → `path.resume`
 * 3. Which offline mission is active?  → `activeMission`
 * 4. Where did they want more context? → `talkingPoints`
 * 5. When did they last use the app?   → `lastActiveAt`
 *
 * What it does NOT produce, and must not: a score, a grade, a percentage
 * framed as attainment, a comparison between children, or any judgement of a
 * child's character. `docs/CURRICULUM_PRINCIPLES.md` rules out moral scoring,
 * and a dashboard is exactly where that would creep in — so the vocabulary
 * here is limited to "practised", "exploring", "ready to review", and "not
 * started yet", and there is nowhere to put a number that means "how good".
 *
 * Nor does it claim outcomes. A child having finished a lesson means they went
 * through a lesson; it does not mean they are kinder, and nothing here should
 * be phrased as though it did.
 */

/** The neutral vocabulary. There is no "good", "poor", or "behind". */
export type PracticeStatus =
  "not-started" | "exploring" | "practised" | "ready-to-review";

export const practiceStatusLabels = {
  "not-started": "Not started yet",
  exploring: "Exploring",
  practised: "Practised",
  "ready-to-review": "Ready to review",
} satisfies Record<PracticeStatus, string>;

export type SkillAreaSummary = {
  area: SkillArea;
  status: PracticeStatus;
  practisedCount: number;
  lessonCount: number;
};

export type RecentActivity = {
  lesson: Lesson;
  status: PracticeStatus;
  /** ISO timestamp of the child's last visit to this lesson. */
  at: string;
};

export type ActiveMission = {
  lesson: Lesson;
  done: boolean;
  /** The lesson's own question, for the conversation afterwards. */
  conversationPrompt: string;
};

/**
 * A moment where the child picked the "it depends" option.
 *
 * Framed as something to talk about, never as a wrong answer: `needs_context`
 * choices are valid choices whose outcome depends on the situation, which is
 * precisely what makes them worth a conversation. A parent must not read this
 * list as a list of mistakes, so the screen labels it accordingly and the
 * prompt beside it is a question, not a correction.
 */
export type TalkingPoint = {
  lesson: Lesson;
  /** What the scene asked. */
  question: string;
  /** What the child chose. */
  choiceText: string;
  conversationPrompt: string;
};

export type ChildDashboard = {
  path: ModulePath;
  skillAreas: readonly SkillAreaSummary[];
  recent: readonly RecentActivity[];
  activeMission: ActiveMission | null;
  talkingPoints: readonly TalkingPoint[];
  /** Null when the child has not opened a lesson yet. */
  lastActiveAt: string | null;
  /** True when there is nothing at all to show yet. */
  isEmpty: boolean;
};

function statusFor(entry: PathLesson): PracticeStatus {
  switch (entry.state) {
    case "complete":
      return "practised";
    case "in-progress":
      return "exploring";
    default:
      return "not-started";
  }
}

function summariseAreas(lessons: readonly PathLesson[]): SkillAreaSummary[] {
  return skillAreas.flatMap((area) => {
    const inArea = lessons.filter((entry) => entry.lesson?.skillArea === area);
    if (inArea.length === 0) return [];

    const practisedCount = inArea.filter(
      (entry) => entry.state === "complete",
    ).length;
    const exploring = inArea.some((entry) => entry.state === "in-progress");

    let status: PracticeStatus = "not-started";
    if (practisedCount === inArea.length) {
      // Everything here has been through once, so the useful next move is to
      // revisit rather than to press on. Not a reward, and not a finish line.
      status = "ready-to-review";
    } else if (practisedCount > 0) {
      status = "practised";
    } else if (exploring) {
      status = "exploring";
    }

    return [{ area, status, practisedCount, lessonCount: inArea.length }];
  });
}

/**
 * The choices a child made, read back from their saved run.
 *
 * Version-strict, like resuming: a run recorded against different content no
 * longer describes the scenes this lesson has, so it is skipped rather than
 * shown against the wrong question.
 */
function talkingPointsFor(
  entry: PathLesson,
  progress: ProfileProgress,
): TalkingPoint[] {
  const lesson = entry.lesson;
  if (lesson === undefined) return [];

  const run = progress[lesson.id]?.run;
  if (run === undefined || run.lessonVersion !== lesson.version) return [];

  return lesson.scenes.flatMap((scene) => {
    const chosenId = run.state.choiceBySceneId[scene.id];
    const chosen = scene.choices?.find((choice) => choice.id === chosenId);
    if (chosen === undefined || chosen.consequenceType !== "needs_context") {
      return [];
    }

    return [
      {
        lesson,
        question: scene.prompt ?? scene.title,
        choiceText: chosen.text,
        conversationPrompt: lesson.offlineMission.completionQuestion,
      },
    ];
  });
}

export function buildChildDashboard(
  module: CurriculumModule,
  getLesson: (slug: string) => Lesson | undefined,
  progress: ProfileProgress,
  { recentLimit = 3 }: { recentLimit?: number } = {},
): ChildDashboard {
  const path = buildModulePath(module, getLesson, progress);
  const written = path.lessons.filter((entry) => entry.lesson !== undefined);

  const recent = written
    .flatMap((entry) => {
      const lesson = entry.lesson;
      const at =
        lesson === undefined ? undefined : progress[lesson.id]?.updatedAt;
      if (lesson === undefined || at === undefined) return [];
      return [{ lesson, status: statusFor(entry), at }];
    })
    // Most recent first. Timestamps are ISO, so string order is time order.
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, recentLimit);

  // The mission worth doing now is the one from the most recently finished
  // lesson — the thing still fresh in everyone's mind.
  const missionEntry = written
    .filter((entry) => entry.state === "complete" && entry.completedAt)
    .sort((a, b) =>
      (b.completedAt ?? "").localeCompare(a.completedAt ?? ""),
    )[0];

  const activeMission =
    missionEntry?.lesson === undefined
      ? null
      : {
          lesson: missionEntry.lesson,
          done: missionEntry.missionDone === true,
          conversationPrompt:
            missionEntry.lesson.offlineMission.completionQuestion,
        };

  const talkingPoints = written.flatMap((entry) =>
    talkingPointsFor(entry, progress),
  );

  const timestamps = written.flatMap((entry) => {
    const at =
      entry.lesson === undefined
        ? undefined
        : progress[entry.lesson.id]?.updatedAt;
    return at === undefined ? [] : [at];
  });
  const lastActiveAt =
    timestamps.length === 0
      ? null
      : timestamps.reduce((latest, at) => (at > latest ? at : latest));

  return {
    path,
    skillAreas: summariseAreas(path.lessons),
    recent,
    activeMission,
    talkingPoints,
    lastActiveAt,
    isEmpty: path.completedCount === 0 && recent.length === 0,
  };
}
