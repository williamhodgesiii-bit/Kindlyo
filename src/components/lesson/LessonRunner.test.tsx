import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { makeTestLesson } from "@/features/curriculum/fixtures";
import { LessonRunner } from "./LessonRunner";

/**
 * The renderer, driven the way a child would drive it.
 *
 * These cover the two behaviours the lesson engine exists for: you cannot skip
 * a decision, and every choice answers with its own feedback.
 */

const lesson = makeTestLesson();

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
