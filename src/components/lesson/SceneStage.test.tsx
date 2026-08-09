import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SceneStage } from "./SceneStage";

/**
 * The scene stage is decorative kit geometry. Its whole job is to be a themed
 * picture the narration never depends on, so these specs pin the two things that
 * keep it honest: it is hidden from assistive technology, and it carries no
 * words a reader could miss by not seeing it.
 */
describe("SceneStage", () => {
  it("is decorative — hidden from assistive tech and wordless", () => {
    const { container } = render(<SceneStage />);

    const root = container.firstElementChild;
    expect(root).toHaveAttribute("aria-hidden", "true");
    // No text: the situation lives entirely in the narration beside it.
    expect(container.textContent).toBe("");
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("themes to a given module world", () => {
    const { container } = render(<SceneStage moduleId="hello-garden" />);
    expect(
      container.querySelector('[data-module="hello-garden"]'),
    ).not.toBeNull();
  });

  it("reflects a made choice with the consequence variant", () => {
    const scene = render(<SceneStage variant="scene" />);
    expect(
      scene.container.querySelector('[data-variant="scene"]'),
    ).not.toBeNull();

    const consequence = render(<SceneStage variant="consequence" />);
    expect(
      consequence.container.querySelector('[data-variant="consequence"]'),
    ).not.toBeNull();
  });

  it("enters with the scene motion, which reduced-motion collapses", () => {
    const { container } = render(<SceneStage />);
    expect(container.querySelector(".llc-scene-enter")).not.toBeNull();
  });

  it("renders a place chosen by the illustration key", () => {
    const cafe = render(<SceneStage illustrationKey="cafe-table" />);
    expect(
      cafe.container.querySelector('[data-archetype="table"]'),
    ).not.toBeNull();

    const treehouse = render(<SceneStage illustrationKey="treehouse-canopy" />);
    expect(
      treehouse.container.querySelector('[data-archetype="canopy"]'),
    ).not.toBeNull();
  });

  it("gives two different scenes different geometry", () => {
    const cafe = render(<SceneStage illustrationKey="cafe-table" />);
    const door = render(<SceneStage illustrationKey="home-door" />);
    // The whole point: beats stop looking identical.
    expect(cafe.container.innerHTML).not.toBe(door.container.innerHTML);
  });

  it("falls back to the neutral gathering place for an unknown key", () => {
    const { container } = render(<SceneStage illustrationKey="mystery-key" />);
    expect(
      container.querySelector('[data-archetype="gathering"]'),
    ).not.toBeNull();
  });

  it("keeps the same place once a choice is made", () => {
    // The stage's only scene input is the key; making a choice flips the
    // variant but must not move the child to a different place. The archetype
    // is a pure function of the key, so it holds across scene → consequence —
    // part of keeping the picture from grading a decision
    // (docs/CURRICULUM_PRINCIPLES.md, "no right answer").
    const archetypeOf = (variant: "scene" | "consequence") =>
      render(<SceneStage illustrationKey="cafe-table" variant={variant} />)
        .container.querySelector("[data-archetype]")
        ?.getAttribute("data-archetype");

    expect(archetypeOf("scene")).toBe("table");
    expect(archetypeOf("consequence")).toBe("table");
  });
});
