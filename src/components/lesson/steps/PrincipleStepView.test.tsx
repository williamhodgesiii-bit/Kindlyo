import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PrincipleStepView } from "./PrincipleStepView";
import type { LessonPrinciple } from "@/features/curriculum/schema";

const principle: LessonPrinciple = {
  title: "A hello tells someone you noticed them",
  body: "When you greet somebody, you are telling them you can see them.",
  points: [
    "A hello can be words, a wave, a nod, a smile, or a sign.",
    "You never have to look someone in the eye.",
    "You never have to be touched to say hello, and you can say no to that.",
    "If a place feels unsafe, walk away and find a grown-up you trust.",
    "Families and countries greet in different ways, and all of them count.",
  ],
};

describe("PrincipleStepView", () => {
  it("renders the title as the step heading and the full why", () => {
    render(<PrincipleStepView principle={principle} />);

    expect(
      screen.getByRole("heading", { level: 2, name: principle.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(principle.body)).toBeInTheDocument();
  });

  it("takes a caller-controlled heading level so outlines never skip", () => {
    render(<PrincipleStepView principle={principle} headingLevel={3} />);

    expect(
      screen.getByRole("heading", { level: 3, name: principle.title }),
    ).toBeInTheDocument();
    // "Worth remembering" sits one level below the title.
    expect(
      screen.getByRole("heading", { level: 4, name: "Worth remembering" }),
    ).toBeInTheDocument();
  });

  it("shows every qualifier as a real list item, in source order", () => {
    render(<PrincipleStepView principle={principle} />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(principle.points.length);
    expect(items.map((item) => item.textContent)).toEqual(principle.points);
  });

  it("keeps the safety and consent points fully visible, never hidden", () => {
    render(<PrincipleStepView principle={principle} />);

    // The consent and walk-away lines carry the load-bearing meaning; they
    // must be plain visible text, not behind a control or aria-hidden.
    for (const point of principle.points) {
      const node = screen.getByText(point);
      expect(node).toBeVisible();
      expect(node.closest("[aria-hidden='true']")).toBeNull();
    }
  });

  it("puts no qualifier behind an interactive control", () => {
    render(<PrincipleStepView principle={principle} />);

    // Nothing to tap, expand, or collapse — the points are always rendered.
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
