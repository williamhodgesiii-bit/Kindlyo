import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeTestLesson } from "@/features/curriculum/fixtures";
import { readProfileProgress } from "@/features/lessons/progressStorage";
import {
  createProfile,
  selectProfile,
} from "@/features/profiles/profileStorage";
import { LessonRunner } from "./LessonRunner";

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
 * The renderer, driven the way a child would drive it.
 *
 * These cover the two behaviours the lesson engine exists for: you cannot skip
 * a decision, and every choice answers with its own feedback.
 */

/**
 * The fixture lesson stands in for lesson one: its id and slug match the first
 * lesson of the real module, so the path guard treats it as the open lesson
 * rather than a locked one.
 */
const lesson = makeTestLesson({ id: "saying-hello", slug: "saying-hello" });

let profileId = "";

function seedSelectedProfile(nickname = "Ada"): string {
  const result = createProfile(
    { nickname: nickname, ageBand: "5–6" },
    window.localStorage,
  );
  if (!result.ok) throw new Error("could not seed a profile");
  selectProfile(result.profile.id, window.localStorage);
  return result.profile.id;
}

function next() {
  return screen.getByRole("button", { name: "Next" });
}

async function goTo(
  user: ReturnType<typeof userEvent.setup>,
  target: "practice" | "completion",
) {
  await user.click(next()); // to the decision
  await user.click(screen.getByRole("button", { name: /Do the first thing/ }));
  await user.click(next()); // to the principle
  await user.click(next()); // to the practice
  if (target === "practice") return;

  await user.click(screen.getByRole("button", { name: /The first way/ }));
  await user.click(next()); // to the mission
  await user.click(next()); // to the coaching
  await user.click(next()); // to the completion
}

beforeEach(() => {
  window.localStorage.clear();
  profileId = seedSelectedProfile();
});

describe("LessonRunner", () => {
  it("opens on the first scene", async () => {
    render(<LessonRunner lesson={lesson} />);

    expect(
      await screen.findByRole("heading", { name: "The opening" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Something happens.")).toBeInTheDocument();
  });

  it("shows the lesson title and its review status", async () => {
    render(<LessonRunner lesson={lesson} />);

    expect(
      await screen.findByRole("heading", { level: 1, name: "A test lesson" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("shows where you are, as a position rather than a score", async () => {
    render(<LessonRunner lesson={lesson} />);

    const progress = await screen.findByRole("progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "1");
    expect(progress).toHaveAttribute("aria-valuemax", "7");
  });

  it("cannot go back from the first step", async () => {
    render(<LessonRunner lesson={lesson} />);

    expect(await screen.findByRole("button", { name: "Back" })).toBeDisabled();
  });

  it("will not move past the decision until a choice is made", async () => {
    const user = userEvent.setup();
    render(<LessonRunner lesson={lesson} />);

    await user.click(await screen.findByRole("button", { name: "Next" }));

    expect(
      screen.getByRole("heading", { name: "What could you do?" }),
    ).toBeInTheDocument();
    expect(next()).toBeDisabled();
    expect(screen.getByText("Choose one to carry on.")).toBeInTheDocument();
  });

  it("answers each choice with its own feedback", async () => {
    const user = userEvent.setup();
    render(<LessonRunner lesson={lesson} />);
    await user.click(await screen.findByRole("button", { name: "Next" }));

    await user.click(
      screen.getByRole("button", { name: /Do the first thing/ }),
    );
    expect(
      screen.getByText("Here is what tends to follow."),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /Do the second thing/ }),
    );
    expect(
      screen.getByText("This one could go either way."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Here is what tends to follow."),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /Do the third thing/ }),
    );
    expect(
      screen.getByText("This one depends on the situation."),
    ).toBeInTheDocument();
  });

  it("never marks a choice right or wrong", async () => {
    const user = userEvent.setup();
    render(<LessonRunner lesson={lesson} />);
    await user.click(await screen.findByRole("button", { name: "Next" }));
    await user.click(
      screen.getByRole("button", { name: /Do the second thing/ }),
    );

    expect(screen.queryByText(/correct/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/wrong/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/well done/i)).not.toBeInTheDocument();
  });

  it("keeps the chosen answer when you go back to re-read it", async () => {
    const user = userEvent.setup();
    render(<LessonRunner lesson={lesson} />);
    await user.click(await screen.findByRole("button", { name: "Next" }));
    await user.click(
      screen.getByRole("button", { name: /Do the third thing/ }),
    );
    await user.click(next());
    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(
      screen.getByRole("button", { name: /Do the third thing/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("will not move past the rehearsal until an option is picked", async () => {
    const user = userEvent.setup();
    render(<LessonRunner lesson={lesson} />);
    await screen.findByRole("heading", { name: "The opening" });

    await goTo(user, "practice");

    expect(
      screen.getByRole("heading", { name: "Your turn." }),
    ).toBeInTheDocument();
    expect(next()).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /The second way/ }));
    expect(screen.getByText("That works too.")).toBeInTheDocument();
    expect(next()).toBeEnabled();
  });

  it("shows the offline mission and the parent coaching before the end", async () => {
    const user = userEvent.setup();
    render(<LessonRunner lesson={lesson} />);
    await screen.findByRole("heading", { name: "The opening" });

    await user.click(next());
    await user.click(
      screen.getByRole("button", { name: /Do the first thing/ }),
    );
    await user.click(next());
    await user.click(next());
    await user.click(screen.getByRole("button", { name: /The first way/ }));
    await user.click(next());

    expect(
      screen.getByText("Try it before the next lesson."),
    ).toBeInTheDocument();

    await user.click(next());
    expect(screen.getByText("Go first yourself.")).toBeInTheDocument();
  });

  it("finishes with a recap and no way to advance further", async () => {
    const user = userEvent.setup();
    render(<LessonRunner lesson={lesson} />);
    await screen.findByRole("heading", { name: "The opening" });

    await goTo(user, "completion");

    expect(
      screen.getByRole("heading", { name: "You finished the test lesson" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Do the first thing")).toBeInTheDocument();
    expect(screen.getByText("The first way")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).toBeNull();
  });

  it("starts the lesson over on request", async () => {
    const user = userEvent.setup();
    render(<LessonRunner lesson={lesson} />);
    await screen.findByRole("heading", { name: "The opening" });

    await goTo(user, "completion");
    await user.click(
      screen.getByRole("button", { name: "Start this lesson again" }),
    );

    expect(
      screen.getByRole("heading", { name: "The opening" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "1",
    );
  });

  it("resumes where the child left off after a reload", async () => {
    const user = userEvent.setup();
    const first = render(<LessonRunner lesson={lesson} />);
    await screen.findByRole("heading", { name: "The opening" });

    await user.click(next());
    await user.click(
      screen.getByRole("button", { name: /Do the second thing/ }),
    );
    first.unmount();

    render(<LessonRunner lesson={lesson} />);

    expect(
      await screen.findByRole("heading", { name: "What could you do?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Do the second thing/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("starts fresh when the saved progress belongs to an older version", async () => {
    const user = userEvent.setup();
    const first = render(<LessonRunner lesson={lesson} />);
    await screen.findByRole("heading", { name: "The opening" });
    await user.click(next());
    first.unmount();

    render(<LessonRunner lesson={{ ...lesson, version: 2 }} />);

    expect(
      await screen.findByRole("heading", { name: "The opening" }),
    ).toBeInTheDocument();
  });

  it("moves focus to the step when the step changes", async () => {
    const user = userEvent.setup();
    render(<LessonRunner lesson={lesson} />);
    await screen.findByRole("heading", { name: "The opening" });

    await user.click(next());

    const heading = screen.getByRole("heading", { name: "The decision" });
    expect(document.activeElement).toBe(heading.closest("[tabindex='-1']"));
  });
});

describe("the profile gate", () => {
  it("asks who is learning before starting a lesson", async () => {
    window.localStorage.clear();
    render(<LessonRunner lesson={lesson} />);

    expect(
      await screen.findByRole("heading", { name: "Who is learning?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Choose a profile" }),
    ).toHaveAttribute("href", "/learn");
    expect(screen.queryByText("Something happens.")).not.toBeInTheDocument();
  });

  it("will not open a lesson the child has not unlocked", async () => {
    // Lesson two, with lesson one unfinished.
    const locked = makeTestLesson({
      id: "introducing-yourself",
      slug: "introducing-yourself",
      order: 2,
    });
    render(<LessonRunner lesson={locked} />);

    expect(
      await screen.findByRole("heading", { name: "Not this one yet" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/opens after lesson 1/)).toBeInTheDocument();
    expect(screen.queryByText("Something happens.")).not.toBeInTheDocument();
  });
});

describe("recording completion", () => {
  it("records the lesson and its version against the chosen profile", async () => {
    const user = userEvent.setup();
    render(<LessonRunner lesson={lesson} />);
    await screen.findByRole("heading", { name: "The opening" });

    await goTo(user, "completion");

    const entry = readProfileProgress(profileId, window.localStorage)[
      lesson.id
    ];
    expect(entry?.completion?.lessonVersion).toBe(lesson.version);
    expect(entry?.completion?.completedAt).toEqual(expect.any(String));
  });

  it("records nothing against any other profile", async () => {
    const user = userEvent.setup();
    const other = createProfile(
      { nickname: "Ben", ageBand: "7–9" },
      window.localStorage,
    );
    if (!other.ok) throw new Error("could not seed a second profile");

    render(<LessonRunner lesson={lesson} />);
    await screen.findByRole("heading", { name: "The opening" });
    await goTo(user, "completion");

    expect(readProfileProgress(other.profile.id, window.localStorage)).toEqual(
      {},
    );
  });

  it("keeps the completion when the lesson is started again", async () => {
    const user = userEvent.setup();
    render(<LessonRunner lesson={lesson} />);
    await screen.findByRole("heading", { name: "The opening" });
    await goTo(user, "completion");

    await user.click(
      screen.getByRole("button", { name: "Start this lesson again" }),
    );

    // Replaying must not re-lock the lessons this one unlocked.
    expect(
      readProfileProgress(profileId, window.localStorage)[lesson.id]
        ?.completion,
    ).toBeDefined();
  });
});
