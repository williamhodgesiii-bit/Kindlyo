import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { recordCompletion } from "@/features/lessons/progressStorage";
import {
  createProfile,
  selectProfile,
} from "@/features/profiles/profileStorage";
import { LearningPath } from "./LearningPath";

// Offline, the async family client resolves to the prototype stores backed by
// this browser's local storage, so these specs seed and assert through
// `window.localStorage` and mock only the client in between.
vi.mock("@/features/families/familyClient", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/families/familyClient")>();
  return {
    ...actual,
    getFamilyClient: () =>
      actual.createLocalFamilyClient(() => window.localStorage),
  };
});

/**
 * The path screen, driven the way a family would drive it.
 *
 * Profiles are seeded through the real storage helpers rather than mocked, so
 * these also cover the wiring between the two stores.
 */

function seedProfile(nickname: string): string {
  const result = createProfile(
    { nickname: nickname, ageBand: "5–6" },
    window.localStorage,
  );
  if (!result.ok) throw new Error("could not seed a profile");
  return result.profile.id;
}

function rowFor(order: number): HTMLElement {
  const items = screen.getAllByRole("listitem");
  const row = items.find((item) =>
    within(item).queryByText(`Lesson ${order}:`, { exact: false }),
  );
  if (row === undefined) throw new Error(`no row for lesson ${order}`);
  return row;
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("before a profile exists", () => {
  it("sends the grown-up to the parent area", async () => {
    render(<LearningPath />);

    expect(
      await screen.findByRole("heading", {
        name: "First, a grown-up sets up a profile",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go to the parent area" }),
    ).toHaveAttribute("href", "/parent");
  });
});

describe("choosing who is learning", () => {
  it("asks which child before showing any lessons", async () => {
    seedProfile("Ada");
    seedProfile("Ben");
    render(<LearningPath />);

    expect(
      await screen.findByRole("heading", { name: "Who is learning?" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ada/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ben/ })).toBeInTheDocument();
    expect(screen.queryByText("Saying hello")).not.toBeInTheDocument();
  });

  it("shows the path once a child is picked", async () => {
    const user = userEvent.setup();
    seedProfile("Ada");
    render(<LearningPath />);

    await user.click(await screen.findByRole("button", { name: /Ada/ }));

    // The path loads from the server after the child is chosen.
    expect(await screen.findByText(/Learning as/)).toBeInTheDocument();
    expect(screen.getByText("Saying hello")).toBeInTheDocument();
  });

  it("goes back to the picker on Switch", async () => {
    const user = userEvent.setup();
    const ada = seedProfile("Ada");
    seedProfile("Ben");
    selectProfile(ada, window.localStorage);
    render(<LearningPath />);

    await user.click(await screen.findByRole("button", { name: "Switch" }));

    expect(
      await screen.findByRole("heading", { name: "Who is learning?" }),
    ).toBeInTheDocument();
  });
});

describe("the path itself", () => {
  beforeEach(() => {
    const ada = seedProfile("Ada");
    selectProfile(ada, window.localStorage);
  });

  it("lists all eight lessons of the module", async () => {
    render(<LearningPath />);
    await screen.findByText(/Learning as/);

    expect(screen.getAllByRole("listitem")).toHaveLength(8);
  });

  it("opens lesson one and locks the rest for a new child", async () => {
    render(<LearningPath />);
    await screen.findByText(/Learning as/);

    expect(
      within(rowFor(1)).getByRole("link", { name: /Start lesson 1:/ }),
    ).toBeInTheDocument();
    expect(
      within(rowFor(2)).getByText("Finish lesson 1 first"),
    ).toBeInTheDocument();
  });

  it("gives a locked lesson no link and no button to be refused by", async () => {
    render(<LearningPath />);
    await screen.findByText(/Learning as/);

    const locked = rowFor(3);
    expect(within(locked).queryByRole("link")).toBeNull();
    expect(within(locked).queryByRole("button")).toBeNull();
  });

  it("counts progress as position, not as a score", async () => {
    render(<LearningPath />);
    await screen.findByText(/Learning as/);

    const progress = screen.getByRole("progressbar", {
      name: "Lessons finished",
    });
    expect(progress).toHaveAttribute("aria-valuenow", "0");
    expect(progress).toHaveAttribute("aria-valuemax", "8");
  });

  it("has no streak, ranking, or falling-behind language", async () => {
    render(<LearningPath />);
    await screen.findByText(/Learning as/);

    expect(screen.queryByText(/streak/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/behind/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/points/i)).not.toBeInTheDocument();
  });
});

describe("after finishing a lesson", () => {
  beforeEach(() => {
    const ada = seedProfile("Ada");
    selectProfile(ada, window.localStorage);
    recordCompletion(
      ada,
      "saying-hello",
      1,
      "2026-08-04T10:00:00.000Z",
      window.localStorage,
    );
  });

  it("marks it done and unlocks the next one", async () => {
    render(<LearningPath />);
    await screen.findByText(/Learning as/);

    expect(within(rowFor(1)).getByText("Done")).toBeInTheDocument();
    expect(
      within(rowFor(2)).getByRole("link", { name: /Start lesson 2:/ }),
    ).toBeInTheDocument();
  });

  it("keeps the finished lesson playable again", async () => {
    render(<LearningPath />);
    await screen.findByText(/Learning as/);

    expect(
      within(rowFor(1)).getByRole("link", { name: /Play again lesson 1:/ }),
    ).toBeInTheDocument();
  });

  it("counts it towards the module", async () => {
    render(<LearningPath />);
    await screen.findByText(/Learning as/);

    expect(
      screen.getByRole("progressbar", { name: "Lessons finished" }),
    ).toHaveAttribute("aria-valuenow", "1");
  });

  it("points the resume button at the next lesson", async () => {
    render(<LearningPath />);
    await screen.findByText(/Learning as/);

    // The prominent call to action above the list, not a row button.
    expect(
      screen.getByRole("link", { name: "Start lesson 2" }),
    ).toHaveAttribute("href", "/learn/lesson/introducing-yourself");
  });
});

describe("profile separation", () => {
  it("never shows one child's progress on another child's path", async () => {
    const user = userEvent.setup();
    const ada = seedProfile("Ada");
    seedProfile("Ben");
    recordCompletion(
      ada,
      "saying-hello",
      1,
      "2026-08-04T10:00:00.000Z",
      window.localStorage,
    );

    render(<LearningPath />);

    // Ada has finished one lesson.
    await user.click(await screen.findByRole("button", { name: /Ada/ }));
    expect(
      await screen.findByRole("progressbar", { name: "Lessons finished" }),
    ).toHaveAttribute("aria-valuenow", "1");
    expect(within(rowFor(1)).getByText("Done")).toBeInTheDocument();

    // Ben has not, and lesson two is still locked for him.
    await user.click(await screen.findByRole("button", { name: "Switch" }));
    await user.click(await screen.findByRole("button", { name: /Ben/ }));

    expect(
      await screen.findByRole("progressbar", { name: "Lessons finished" }),
    ).toHaveAttribute("aria-valuenow", "0");
    expect(within(rowFor(1)).queryByText("Done")).toBeNull();
    expect(
      within(rowFor(2)).getByText("Finish lesson 1 first"),
    ).toBeInTheDocument();
  });
});

describe("the child-facing picker", () => {
  it("shows a picture and a name for each child, and little else", async () => {
    createProfile(
      { nickname: "Ada", ageBand: "5–6", avatarId: "fox" },
      window.localStorage,
    );
    seedProfile("Ben");
    render(<LearningPath />);
    await screen.findByRole("heading", { name: "Who is learning?" });

    // One button per child, named by the child. The avatar is decorative, so
    // it adds nothing to the accessible name. No age bands, no instructions.
    const choices = screen.getAllByRole("button");
    expect(choices).toHaveLength(2);
    expect(choices[0]).toHaveAccessibleName("Ada");
    expect(choices[1]).toHaveAccessibleName("Ben");
    expect(screen.queryByText(/Ages/)).toBeNull();
  });

  it("keeps a way back to the parent area", async () => {
    seedProfile("Ada");
    render(<LearningPath />);
    await screen.findByRole("heading", { name: "Who is learning?" });

    expect(screen.getByRole("link", { name: "For grown-ups" })).toHaveAttribute(
      "href",
      "/parent",
    );
  });

  it("remembers the choice, so a reload does not ask again", async () => {
    const user = userEvent.setup();
    seedProfile("Ada");
    const first = render(<LearningPath />);

    await user.click(await screen.findByRole("button", { name: /Ada/ }));
    first.unmount();

    render(<LearningPath />);

    expect(await screen.findByText(/Learning as/)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Who is learning?" }),
    ).toBeNull();
  });
});
