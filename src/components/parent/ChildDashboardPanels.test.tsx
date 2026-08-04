import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { meetingPeopleModule } from "@/content/modules";
import { getLessonBySlug } from "@/features/curriculum/catalog";
import { buildChildDashboard } from "@/features/lessons/childDashboard";
import type { ProfileProgress } from "@/features/lessons/progressStorage";
import {
  CurrentMission,
  describeWhen,
  ProgressOverview,
  RecentActivity,
  SkillAreaSummary,
  TalkingPoints,
} from "./ChildDashboardPanels";

const AUG_4 = "2026-08-04T10:00:00.000Z";

function dashboardFor(progress: ProfileProgress) {
  return buildChildDashboard(meetingPeopleModule, getLessonBySlug, progress);
}

const practisedOne = dashboardFor({
  "saying-hello": {
    completion: { lessonVersion: 1, completedAt: AUG_4 },
    updatedAt: AUG_4,
    run: {
      lessonVersion: 1,
      state: {
        stepIndex: 6,
        choiceBySceneId: { "the-first-moment": "wave-instead" },
        practiceOptionId: "wave-hello",
        completedAt: AUG_4,
      },
    },
  },
});

const untouched = dashboardFor({});

describe("progress overview", () => {
  it("answers what was practised and what is next", () => {
    render(<ProgressOverview dashboard={practisedOne} />);

    expect(
      screen.getByRole("progressbar", { name: /lessons practised/i }),
    ).toHaveAttribute("aria-valuenow", "1");
    expect(screen.getByText(/2\. Introducing yourself/)).toBeInTheDocument();
  });

  it("answers when the app was last used", () => {
    render(<ProgressOverview dashboard={practisedOne} />);

    // A definition list, so the label and the value are associated rather than
    // merely adjacent.
    const term = screen.getByText("Last used");
    expect(term.tagName).toBe("DT");
    expect(term.nextElementSibling?.tagName).toBe("DD");
    expect(term.nextElementSibling?.textContent).not.toBe("Not yet");
  });

  it("says plainly when nothing has happened yet", () => {
    render(<ProgressOverview dashboard={untouched} />);

    expect(screen.getByText("Not yet")).toBeInTheDocument();
  });

  it("shows position, never a percentage or a grade", () => {
    render(<ProgressOverview dashboard={practisedOne} />);

    expect(screen.queryByText(/%/)).toBeNull();
    expect(screen.queryByText(/score|grade|rank/i)).toBeNull();
  });
});

describe("skill areas", () => {
  it("summarises each area with a neutral status", () => {
    render(<SkillAreaSummary dashboard={practisedOne} />);

    const list = screen.getByRole("list");
    expect(within(list).getByText("Greeting people")).toBeInTheDocument();
    expect(within(list).getByText("Ready to review")).toBeInTheDocument();
    expect(within(list).getAllByText("Not started yet").length).toBeGreaterThan(
      0,
    );
  });

  it("says the areas describe lessons rather than the child", () => {
    render(<SkillAreaSummary dashboard={practisedOne} />);

    expect(
      screen.getByText(/describe the lessons, not your\s+child/),
    ).toBeInTheDocument();
  });

  it("names no trait of a child anywhere", () => {
    const { container } = render(<SkillAreaSummary dashboard={practisedOne} />);

    const text = container.textContent?.toLowerCase() ?? "";
    for (const banned of ["polite", "rude", "good", "badly", "well-behaved"]) {
      expect(text).not.toContain(banned);
    }
  });
});

describe("recent lessons", () => {
  it("lists what was opened and when", () => {
    render(<RecentActivity dashboard={practisedOne} />);

    expect(screen.getByText("Saying hello")).toBeInTheDocument();
    expect(screen.getByText(/Practised ·/)).toBeInTheDocument();
  });

  it("carries status in words, not only an icon", () => {
    render(<RecentActivity dashboard={practisedOne} />);

    expect(screen.getByText(/Practised/)).toBeInTheDocument();
  });

  it("has an empty state of its own", () => {
    render(<RecentActivity dashboard={untouched} />);

    expect(screen.getByText(/Nothing yet/)).toBeInTheDocument();
  });
});

describe("current mission", () => {
  it("shows the active one with a try-together label", () => {
    render(<CurrentMission dashboard={practisedOne} onToggle={vi.fn()} />);

    expect(screen.getByText("Try together")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Saying hello" }),
    ).toBeInTheDocument();
  });

  it("offers the conversation prompt for afterwards", () => {
    render(<CurrentMission dashboard={practisedOne} onToggle={vi.fn()} />);

    expect(screen.getByText(/Afterwards:/)).toBeInTheDocument();
  });

  it("can be marked done", async () => {
    const onToggle = vi.fn();
    render(<CurrentMission dashboard={practisedOne} onToggle={onToggle} />);

    screen.getByRole("button", { name: /Mark as done/ }).click();

    expect(onToggle).toHaveBeenCalledWith("saying-hello", false);
  });

  it("has an empty state before any lesson is finished", () => {
    render(<CurrentMission dashboard={untouched} onToggle={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "No mission yet" }),
    ).toBeInTheDocument();
  });
});

describe("things worth talking about", () => {
  it("frames an it-depends choice as a conversation, not a mistake", () => {
    render(<TalkingPoints dashboard={practisedOne} />);

    expect(screen.getByText("Worth talking about")).toBeInTheDocument();
    expect(screen.getByText(/These are not wrong answers/)).toBeInTheDocument();
    expect(screen.getByText(/They chose:/)).toBeInTheDocument();
    expect(screen.getByText(/Try asking:/)).toBeInTheDocument();
  });

  it("uses no corrective or judging language", () => {
    const { container } = render(<TalkingPoints dashboard={practisedOne} />);

    const text = container.textContent?.toLowerCase() ?? "";
    for (const banned of ["incorrect", "mistake", "should have", "failed"]) {
      expect(text).not.toContain(banned);
    }
  });

  it("explains itself when there is nothing flagged", () => {
    render(<TalkingPoints dashboard={untouched} />);

    expect(
      screen.getByRole("heading", { name: "Nothing flagged yet" }),
    ).toBeInTheDocument();
  });
});

describe("describeWhen", () => {
  const now = new Date("2026-08-10T12:00:00.000Z");

  it("reads as plain language rather than a timestamp", () => {
    expect(describeWhen("2026-08-10T08:00:00.000Z", now)).toBe("today");
    expect(describeWhen("2026-08-09T08:00:00.000Z", now)).toBe("yesterday");
    expect(describeWhen("2026-08-07T08:00:00.000Z", now)).toBe("3 days ago");
    expect(describeWhen("2026-08-02T08:00:00.000Z", now)).toBe("last week");
    expect(describeWhen("2026-07-20T08:00:00.000Z", now)).toBe("3 weeks ago");
    expect(describeWhen("2026-01-20T08:00:00.000Z", now)).toBe("a while ago");
  });

  it("degrades quietly on a value that is not a date", () => {
    expect(describeWhen("not a date", now)).toBe("recently");
  });

  it("never implies lateness or a broken habit", () => {
    // "a while ago" is as pointed as this gets: no "you have not practised in
    // 3 weeks", no streak, nothing that reads as a telling-off.
    expect(describeWhen("2026-01-20T08:00:00.000Z", now)).not.toMatch(
      /should|overdue|missed|lost/i,
    );
  });
});
