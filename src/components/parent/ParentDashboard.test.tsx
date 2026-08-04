import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import {
  readProfileProgress,
  recordCompletion,
} from "@/features/lessons/progressStorage";
import {
  createProfile,
  readFamilyState,
} from "@/features/profiles/profileStorage";
import { ParentDashboard } from "./ParentDashboard";

/** Seeded through the real stores, so the wiring is covered too. */
function seedProfile(nickname: string): string {
  const result = createProfile(nickname, "5–6", window.localStorage);
  if (!result.ok) throw new Error("could not seed a profile");
  return result.profile.id;
}

function finishLesson(profileId: string, lessonId: string) {
  recordCompletion(
    profileId,
    lessonId,
    1,
    "2026-08-04T10:00:00.000Z",
    window.localStorage,
  );
}

function panelFor(nickname: string): HTMLElement {
  return screen.getByRole("region", { name: nickname });
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("creating profiles", () => {
  it("starts with an empty state and a form", async () => {
    render(<ParentDashboard />);

    expect(
      await screen.findByRole("heading", { name: "No profiles yet" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nickname")).toBeInTheDocument();
  });

  it("adds a profile", async () => {
    const user = userEvent.setup();
    render(<ParentDashboard />);

    await user.type(await screen.findByLabelText("Nickname"), "Ada");
    await user.click(screen.getByRole("button", { name: "Add profile" }));

    expect(screen.getByRole("heading", { name: "Ada" })).toBeInTheDocument();
    expect(readFamilyState(window.localStorage).profiles).toHaveLength(1);
  });

  it("stores the chosen age band", async () => {
    const user = userEvent.setup();
    render(<ParentDashboard />);

    await user.type(await screen.findByLabelText("Nickname"), "Ben");
    await user.click(screen.getByRole("radio", { name: "Ages 7–9" }));
    await user.click(screen.getByRole("button", { name: "Add profile" }));

    expect(readFamilyState(window.localStorage).profiles[0]?.ageBand).toBe(
      "7–9",
    );
  });

  it("says so rather than saving an empty nickname", async () => {
    const user = userEvent.setup();
    render(<ParentDashboard />);

    await user.click(
      await screen.findByRole("button", { name: "Add profile" }),
    );

    expect(screen.getByText("Please enter a nickname.")).toBeInTheDocument();
    expect(readFamilyState(window.localStorage).profiles).toHaveLength(0);
  });

  it("explains the limit at three profiles instead of failing silently", async () => {
    seedProfile("Ada");
    seedProfile("Ben");
    seedProfile("Cal");
    render(<ParentDashboard />);

    expect(
      await screen.findByText("Three profiles is the maximum"),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Nickname")).not.toBeInTheDocument();
  });
});

describe("progress and missions", () => {
  it("shows a calm empty state before any lesson is finished", async () => {
    seedProfile("Ada");
    render(<ParentDashboard />);

    expect(
      await screen.findByRole("heading", { name: "No missions yet" }),
    ).toBeInTheDocument();
  });

  it("shows the module count and the mission once a lesson is finished", async () => {
    const ada = seedProfile("Ada");
    finishLesson(ada, "saying-hello");
    render(<ParentDashboard />);

    const panel = panelFor("Ada");
    expect(
      await within(panel).findByRole("progressbar", {
        name: /lessons finished/i,
      }),
    ).toHaveAttribute("aria-valuenow", "1");
    expect(
      within(panel).getByRole("heading", { name: "Saying hello" }),
    ).toBeInTheDocument();
  });

  it("marks a mission done and back again", async () => {
    const user = userEvent.setup();
    const ada = seedProfile("Ada");
    finishLesson(ada, "saying-hello");
    render(<ParentDashboard />);

    await user.click(
      await screen.findByRole("button", { name: /Mark as done/ }),
    );

    expect(
      readProfileProgress(ada, window.localStorage)["saying-hello"]
        ?.missionStatus,
    ).toBe("done");
    expect(screen.getByText("Done")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /Mark as not done yet/ }),
    );
    expect(
      readProfileProgress(ada, window.localStorage)["saying-hello"]
        ?.missionStatus,
    ).toBeUndefined();
  });

  it("keeps two children's progress on separate cards", async () => {
    const ada = seedProfile("Ada");
    seedProfile("Ben");
    finishLesson(ada, "saying-hello");
    render(<ParentDashboard />);

    expect(
      await within(panelFor("Ada")).findByRole("progressbar", {
        name: /lessons finished/i,
      }),
    ).toHaveAttribute("aria-valuenow", "1");
    expect(
      within(panelFor("Ben")).getByRole("progressbar", {
        name: /lessons finished/i,
      }),
    ).toHaveAttribute("aria-valuenow", "0");
    expect(
      within(panelFor("Ben")).getByRole("heading", { name: "No missions yet" }),
    ).toBeInTheDocument();
  });

  it("shows no streaks, rankings, or comparisons between children", async () => {
    const ada = seedProfile("Ada");
    seedProfile("Ben");
    finishLesson(ada, "saying-hello");
    render(<ParentDashboard />);
    await screen.findByRole("heading", { name: "Ada" });

    expect(screen.queryByText(/streak/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/ahead|behind|leader|rank/i),
    ).not.toBeInTheDocument();
  });
});

describe("resetting progress", () => {
  it("asks first, and does nothing if the parent backs out", async () => {
    const user = userEvent.setup();
    const ada = seedProfile("Ada");
    finishLesson(ada, "saying-hello");
    render(<ParentDashboard />);

    await user.click(
      await screen.findByRole("button", { name: /Reset progress for Ada/ }),
    );
    expect(
      screen.getByRole("dialog", { name: /Reset Ada's progress\?/ }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Keep progress" }));

    expect(
      readProfileProgress(ada, window.localStorage)["saying-hello"],
    ).toBeDefined();
  });

  it("clears that child's progress once confirmed", async () => {
    const user = userEvent.setup();
    const ada = seedProfile("Ada");
    finishLesson(ada, "saying-hello");
    render(<ParentDashboard />);

    await user.click(
      await screen.findByRole("button", { name: /Reset progress for Ada/ }),
    );
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Reset progress",
      }),
    );

    expect(readProfileProgress(ada, window.localStorage)).toEqual({});
    expect(
      await within(panelFor("Ada")).findByRole("progressbar", {
        name: /lessons finished/i,
      }),
    ).toHaveAttribute("aria-valuenow", "0");
  });

  it("leaves the other child's progress alone", async () => {
    const user = userEvent.setup();
    const ada = seedProfile("Ada");
    const ben = seedProfile("Ben");
    finishLesson(ada, "saying-hello");
    finishLesson(ben, "saying-hello");
    render(<ParentDashboard />);

    await user.click(
      await screen.findByRole("button", { name: /Reset progress for Ada/ }),
    );
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Reset progress",
      }),
    );

    expect(readProfileProgress(ada, window.localStorage)).toEqual({});
    expect(
      readProfileProgress(ben, window.localStorage)["saying-hello"],
    ).toBeDefined();
  });

  it("keeps the profile itself", async () => {
    const user = userEvent.setup();
    const ada = seedProfile("Ada");
    finishLesson(ada, "saying-hello");
    render(<ParentDashboard />);

    await user.click(
      await screen.findByRole("button", { name: /Reset progress for Ada/ }),
    );
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Reset progress",
      }),
    );

    expect(readFamilyState(window.localStorage).profiles).toHaveLength(1);
  });
});

describe("deleting a profile", () => {
  it("asks first", async () => {
    const user = userEvent.setup();
    seedProfile("Ada");
    render(<ParentDashboard />);

    await user.click(
      await screen.findByRole("button", { name: /Delete profile: Ada/ }),
    );
    await user.click(screen.getByRole("button", { name: "Keep profile" }));

    expect(readFamilyState(window.localStorage).profiles).toHaveLength(1);
  });

  it("removes the profile and its progress once confirmed", async () => {
    const user = userEvent.setup();
    const ada = seedProfile("Ada");
    finishLesson(ada, "saying-hello");
    render(<ParentDashboard />);

    await user.click(
      await screen.findByRole("button", { name: /Delete profile: Ada/ }),
    );
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Delete profile",
      }),
    );

    expect(readFamilyState(window.localStorage).profiles).toHaveLength(0);
    expect(readProfileProgress(ada, window.localStorage)).toEqual({});
  });
});
