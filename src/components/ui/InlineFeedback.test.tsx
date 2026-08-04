import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { type FeedbackTone, InlineFeedback } from "./InlineFeedback";

const lessonTones: FeedbackTone[] = ["helpful", "mixed", "needs-context"];

describe("InlineFeedback", () => {
  it("announces politely without interrupting", () => {
    render(<InlineFeedback tone="helpful">Maya notices you.</InlineFeedback>);

    const feedback = screen.getByRole("status");
    expect(feedback).toHaveAttribute("aria-live", "polite");
    expect(feedback).toHaveTextContent("Maya notices you.");
  });

  it("interrupts only when something has actually gone wrong", () => {
    render(
      <InlineFeedback tone="problem">We could not save that.</InlineFeedback>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("carries a text title for every tone, never colour alone", () => {
    for (const tone of lessonTones) {
      const { unmount } = render(
        <InlineFeedback tone={tone}>Outcome text.</InlineFeedback>,
      );
      // The title is the non-visual signal that survives greyscale, low
      // vision, and colour blindness.
      expect(screen.getByRole("status").textContent).not.toBe("Outcome text.");
      unmount();
    }
  });

  it("lets the caller supply the wording", () => {
    render(
      <InlineFeedback tone="mixed" title="What might happen">
        Some people would still be waiting.
      </InlineFeedback>,
    );
    expect(screen.getByText("What might happen")).toBeInTheDocument();
  });

  it("never scores the reader's choice", () => {
    // docs/CURRICULUM_PRINCIPLES.md: no moral judgement of the learner.
    for (const tone of lessonTones) {
      const { unmount } = render(
        <InlineFeedback tone={tone}>Outcome text.</InlineFeedback>,
      );
      expect(screen.getByRole("status").textContent).not.toMatch(
        /correct|incorrect|wrong|well done|good job|bad/i,
      );
      unmount();
    }
  });
});
