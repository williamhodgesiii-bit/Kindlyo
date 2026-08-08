import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { OfflineMission } from "@/features/curriculum/schema";
import { MissionStepView } from "./MissionStepView";

/**
 * The mission step is the bridge to real-world practice (CLAUDE.md principle
 * 7). These specs hold the guarantees the redesign must never lose: the three
 * authored parts each render, the child's invitation is the hero while the
 * grown-up notes stay labelled for the adult, the "what happened?" question is
 * a shared conversation rather than a checkpoint, and — the load-bearing one —
 * a child is given no way to mark their own mission done and no reward for it
 * (decisions 023 / 029; principle 5).
 */

const mission: OfflineMission = {
  childPrompt: "Say hello to one person in your own way.",
  parentPrompt:
    "Notice a good moment together — someone at the door, or the bus driver.",
  completionQuestion: "Who did you say hello to, and what happened next?",
};

describe("MissionStepView", () => {
  it("renders all three authored parts of the mission", () => {
    render(<MissionStepView mission={mission} />);

    expect(screen.getByText(mission.childPrompt)).toBeInTheDocument();
    expect(screen.getByText(mission.parentPrompt)).toBeInTheDocument();
    expect(screen.getByText(mission.completionQuestion)).toBeInTheDocument();
  });

  it("makes the child's invitation the hero and keeps the scene out of the accessibility tree", () => {
    const { container } = render(<MissionStepView mission={mission} />);

    expect(
      screen.getByRole("heading", { name: "Try this", level: 3 }),
    ).toBeInTheDocument();

    // The decorative scene is present but announced to no one; all meaning is
    // carried by the text beside it.
    const scene = container.querySelector("svg[role='presentation']");
    expect(scene).not.toBeNull();
    expect(scene).toHaveAttribute("aria-hidden", "true");
    // No remote asset — the scene is inline SVG, never an <img>/src.
    expect(container.querySelector("img")).toBeNull();
  });

  it("keeps the grown-up notes labelled for the adult", () => {
    render(<MissionStepView mission={mission} />);

    expect(screen.getByText("For grown-ups")).toBeInTheDocument();
    const help = screen
      .getByRole("heading", { name: "How to help", level: 3 })
      .closest("section");
    expect(help).not.toBeNull();
    expect(within(help!).getByText(mission.parentPrompt)).toBeInTheDocument();
  });

  it("frames the conversation question as a shared, after-the-fact beat, not a child checkpoint", () => {
    render(<MissionStepView mission={mission} />);

    // It now lives in a grown-up, "later" region…
    expect(screen.getByText("Afterwards, together")).toBeInTheDocument();
    const talk = screen
      .getByRole("heading", { name: "Something to talk about", level: 3 })
      .closest("section");
    expect(talk).not.toBeNull();
    expect(
      within(talk!).getByText(mission.completionQuestion),
    ).toBeInTheDocument();

    // …not tacked onto the child's card as an "Afterwards: …" line.
    expect(screen.queryByText(/^Afterwards:/)).not.toBeInTheDocument();
  });

  it("gives a child no way to mark their own mission done, and no reward", () => {
    const { container } = render(<MissionStepView mission={mission} />);

    // No tappable target of any kind on this step (decisions 023 / 029).
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    expect(container.textContent).not.toMatch(/i did it|mark .*done|tick/i);

    // No points, streaks, badges, or scores (docs/DESIGN_SYSTEM.md; principle 5).
    expect(container.textContent).not.toMatch(/points?|streak|badge|score/i);
  });

  it("uses one h2 for the step and an h3 for each beat, with no skipped levels", () => {
    render(<MissionStepView mission={mission} />);

    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(1);
    expect(h2s[0]).toHaveTextContent("Your mission away from the screen");
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
  });
});
