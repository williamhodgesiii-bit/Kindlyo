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
});
