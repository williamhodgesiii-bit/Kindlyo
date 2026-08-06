import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlimBubble, glimStates } from "./GlimBubble";

describe("GlimBubble", () => {
  it("glows in each of its states without a limb", () => {
    for (const state of Object.keys(
      glimStates,
    ) as (keyof typeof glimStates)[]) {
      const { container, unmount } = render(<GlimBubble state={state} />);
      expect(container.querySelector("svg")).not.toBeNull();
      unmount();
    }
  });

  it("keeps the lantern decorative", () => {
    const { container } = render(<GlimBubble />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("speaks only through the wonder-bubble, as real content", () => {
    render(
      <GlimBubble
        state="wonder_tilt"
        message="I wonder how Maya felt when you waved?"
      />,
    );
    // Glim can't talk; the narrated wonder is the content, and it is a question,
    // never a verdict.
    expect(
      screen.getByText("I wonder how Maya felt when you waved?"),
    ).toBeInTheDocument();
  });

  it("shows no bubble when Glim has nothing to wonder", () => {
    const { container } = render(<GlimBubble state="dim_rest" />);
    expect(container.querySelector("p")).toBeNull();
  });
});
