import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import {
  readProfileProgress,
  recordCompletion,
} from "@/features/lessons/progressStorage";
import {
  completeOnboarding,
  createProfile,
  readFamilyState,
} from "@/features/profiles/profileStorage";
import { ParentArea } from "./ParentArea";

/** Seeded through the real stores, so the wiring is covered too. */
function seedProfile(nickname: string): string {
  const result = createProfile(
    { nickname: nickname, ageBand: "5–6" },
    window.localStorage,
  );
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
  // These cover the dashboard, so onboarding is already behind us. The
  // onboarding flow itself is covered in ParentOnboarding.test.tsx.
  completeOnboarding(window.localStorage);
});

/** The dashboard is reached through ParentArea, which owns the family state. */
function renderDashboard() {
  return render(<ParentArea />);
}

describe("creating profiles", () => {
  async function openAddForm(user: ReturnType<typeof userEvent.setup>) {
    await user.click(
      await screen.findByRole("button", { name: "Add a child" }),
    );
  }

  it("starts with an empty state offering to add one", async () => {
    renderDashboard();

    expect(
      await screen.findByRole("heading", { name: "No profiles yet" }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Nickname")).not.toBeInTheDocument();
  });

  it("adds a profile", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await openAddForm(user);

    await user.type(screen.getByLabelText("Nickname"), "Ada");
    await user.click(screen.getByRole("button", { name: "Create profile" }));

    expect(screen.getByRole("heading", { name: "Ada" })).toBeInTheDocument();
    expect(readFamilyState(window.localStorage).profiles).toHaveLength(1);
  });

  it("stores the chosen age band", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await openAddForm(user);

    await user.type(screen.getByLabelText("Nickname"), "Ben");
    await user.click(screen.getByRole("radio", { name: "Ages 7–9" }));
    await user.click(screen.getByRole("button", { name: "Create profile" }));

    expect(readFamilyState(window.localStorage).profiles[0]?.ageBand).toBe(
      "7–9",
    );
  });

  it("stores an optional avatar, and leaves it out when none is picked", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await openAddForm(user);

    await user.type(screen.getByLabelText("Nickname"), "Ada");
    await user.click(screen.getByRole("radio", { name: "Fox" }));
    await user.click(screen.getByRole("button", { name: "Create profile" }));

    expect(readFamilyState(window.localStorage).profiles[0]?.avatarId).toBe(
      "fox",
    );

    await openAddForm(user);
    await user.type(screen.getByLabelText("Nickname"), "Ben");
    await user.click(screen.getByRole("button", { name: "Create profile" }));

    expect(
      readFamilyState(window.localStorage).profiles[1]?.avatarId,
    ).toBeUndefined();
  });

  it("offers no way to enter a surname, birthday, or email", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await openAddForm(user);

    const fields = screen.getAllByRole("textbox");
    expect(fields).toHaveLength(1);
    expect(fields[0]).toHaveAccessibleName("Nickname");
    expect(
      screen.queryByLabelText(/surname|last name|birth|email/i),
    ).toBeNull();
  });

  it("says so rather than saving an empty nickname", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await openAddForm(user);

    await user.click(screen.getByRole("button", { name: "Create profile" }));

    expect(screen.getByText("Please enter a nickname.")).toBeInTheDocument();
    expect(readFamilyState(window.localStorage).profiles).toHaveLength(0);
  });

  it("explains the limit at three profiles instead of failing silently", async () => {
    seedProfile("Ada");
    seedProfile("Ben");
    seedProfile("Cal");
    renderDashboard();

    expect(
      await screen.findByText("Three profiles is the maximum"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add a child" })).toBeNull();
  });
});

describe("editing a profile", () => {
  it("renames a child", async () => {
    const user = userEvent.setup();
    const ada = seedProfile("Ada");
    renderDashboard();

    await user.click(
      await screen.findByRole("button", { name: "Edit profile: Ada" }),
    );
    const field = within(screen.getByRole("dialog")).getByLabelText("Nickname");
    await user.clear(field);
    await user.type(field, "Adaline");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      screen.getByRole("heading", { name: "Adaline" }),
    ).toBeInTheDocument();
    const stored = readFamilyState(window.localStorage).profiles[0];
    expect(stored?.nickname).toBe("Adaline");
    // Same profile, so progress and identity survive the rename.
    expect(stored?.id).toBe(ada);
  });

  it("changes the age band and the picture", async () => {
    const user = userEvent.setup();
    seedProfile("Ada");
    renderDashboard();

    await user.click(
      await screen.findByRole("button", { name: "Edit profile: Ada" }),
    );
    const dialog = within(screen.getByRole("dialog"));
    await user.click(dialog.getByRole("radio", { name: "Ages 7–9" }));
    await user.click(dialog.getByRole("radio", { name: "Star" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    const stored = readFamilyState(window.localStorage).profiles[0];
    expect(stored?.ageBand).toBe("7–9");
    expect(stored?.avatarId).toBe("star");
  });

  it("removes a picture again", async () => {
    const user = userEvent.setup();
    createProfile(
      { nickname: "Ada", ageBand: "5–6", avatarId: "fox" },
      window.localStorage,
    );
    renderDashboard();

    await user.click(
      await screen.findByRole("button", { name: "Edit profile: Ada" }),
    );
    await user.click(
      within(screen.getByRole("dialog")).getByRole("radio", {
        name: "No picture",
      }),
    );
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      readFamilyState(window.localStorage).profiles[0]?.avatarId,
    ).toBeUndefined();
  });

  it("keeps the old details when the edit is cancelled", async () => {
    const user = userEvent.setup();
    seedProfile("Ada");
    renderDashboard();

    await user.click(
      await screen.findByRole("button", { name: "Edit profile: Ada" }),
    );
    const field = within(screen.getByRole("dialog")).getByLabelText("Nickname");
    await user.clear(field);
    await user.type(field, "Someone else");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(readFamilyState(window.localStorage).profiles[0]?.nickname).toBe(
      "Ada",
    );
    expect(screen.getByRole("heading", { name: "Ada" })).toBeInTheDocument();
  });

  it("refuses to save an empty nickname", async () => {
    const user = userEvent.setup();
    seedProfile("Ada");
    renderDashboard();

    await user.click(
      await screen.findByRole("button", { name: "Edit profile: Ada" }),
    );
    await user.clear(
      within(screen.getByRole("dialog")).getByLabelText("Nickname"),
    );
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(screen.getByText("Please enter a nickname.")).toBeInTheDocument();
    expect(readFamilyState(window.localStorage).profiles[0]?.nickname).toBe(
      "Ada",
    );
  });

  it("edits only the child whose button was pressed", async () => {
    const user = userEvent.setup();
    seedProfile("Ada");
    seedProfile("Ben");
    renderDashboard();

    await user.click(
      await screen.findByRole("button", { name: "Edit profile: Ben" }),
    );
    const field = within(screen.getByRole("dialog")).getByLabelText("Nickname");
    await user.clear(field);
    await user.type(field, "Benji");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    const stored = readFamilyState(window.localStorage).profiles;
    expect(stored.map((profile) => profile.nickname)).toEqual(["Ada", "Benji"]);
  });
});

describe("prototype storage", () => {
  it("says plainly where the data is kept", async () => {
    renderDashboard();

    expect(
      await screen.findByText(/Prototype — stored on this device only/),
    ).toBeInTheDocument();
  });
});

describe("progress and missions", () => {
  it("shows a calm empty state before any lesson is finished", async () => {
    seedProfile("Ada");
    renderDashboard();

    expect(
      await screen.findByRole("heading", { name: "No missions yet" }),
    ).toBeInTheDocument();
  });

  it("shows the module count and the mission once a lesson is finished", async () => {
    const ada = seedProfile("Ada");
    finishLesson(ada, "saying-hello");
    renderDashboard();

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
    renderDashboard();

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
    renderDashboard();

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
    renderDashboard();
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
    renderDashboard();

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
    renderDashboard();

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
    renderDashboard();

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
    renderDashboard();

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
    renderDashboard();

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
    renderDashboard();

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
