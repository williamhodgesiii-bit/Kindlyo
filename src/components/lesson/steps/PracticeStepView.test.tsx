import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PracticeStepView } from "./PracticeStepView";
import type { LessonPractice } from "@/features/curriculum/schema";

const practice: LessonPractice = {
  prompt: "Your turn. Which hello feels right for you?",
  helperText: "There is no single right answer here.",
  options: [
    {
      id: "wave-hello",
      text: "Wave",
      encouragement: "A wave carries just as much.",
      rehearsalCue: "Give a little wave now, or just picture it. Both count.",
    },
    {
      id: "smile-and-nod",
      text: "Smile and nod",
      encouragement: "A nod is a small hello, and it still reaches someone.",
      // Deliberately no rehearsalCue: proves the coda is opt-in per option.
    },
  ],
  closing: "Practising it now makes it easier when it is a real person.",
};

function renderView(selectedOptionId: string | null) {
  return render(
    <PracticeStepView
      practice={practice}
      selectedOptionId={selectedOptionId}
      onPractise={() => {}}
    />,
  );
}

describe("PracticeStepView", () => {
  it("shows no encouragement or rehearsal coda before a choice is made", () => {
    renderView(null);

    expect(screen.queryByText(practice.options[0]!.encouragement)).toBeNull();
    expect(screen.queryByText("Your turn — whenever you are ready")).toBeNull();
    expect(screen.queryByText(practice.closing)).toBeNull();
  });

  it("shows the encouragement and closing the instant a choice is made", () => {
    renderView("wave-hello");

    // Both the warm response and the closing are visible on selection — never
    // gated behind an extra action (safety review: warmth is not earned).
    expect(
      screen.getByText(practice.options[0]!.encouragement),
    ).toBeInTheDocument();
    expect(screen.getByText(practice.closing)).toBeInTheDocument();
  });

  it("renders the chosen option's rehearsalCue in its own quiet region", () => {
    renderView("wave-hello");

    const region = screen.getByRole("region", {
      name: "Your turn — whenever you are ready",
    });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent(practice.options[0]!.rehearsalCue!);
  });

  it("omits the rehearsal coda for an option that has no cue", () => {
    renderView("smile-and-nod");

    // The other content still appears; only the (absent) cue is missing.
    expect(
      screen.getByText(practice.options[1]!.encouragement),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", {
        name: "Your turn — whenever you are ready",
      }),
    ).toBeNull();
  });

  it("never offers a control to confirm an offline behaviour", () => {
    // Decisions 010 & 023: a child gives taps/selections only and never
    // self-reports doing the mission. The only buttons on the step are the
    // practice options themselves — the rehearsal beat adds none.
    renderView("wave-hello");

    const buttons = screen.getAllByRole("button");
    expect(buttons.map((button) => button.textContent)).toEqual(
      practice.options.map((option) => option.text),
    );
    for (const button of buttons) {
      expect(button.textContent).not.toMatch(
        /tried|did it|i did|done|confirm/i,
      );
    }
  });
});
