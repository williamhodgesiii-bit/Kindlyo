import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroScene } from "./HeroScene";

describe("HeroScene", () => {
  it("renders without throwing and produces an SVG", () => {
    const { container } = render(<HeroScene />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("is decorative: it contributes no accessible name, role, or tab stop", () => {
    const { container } = render(<HeroScene />);

    // The scene is hidden from assistive tech at the wrapper...
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveAttribute("aria-hidden", "true");

    // ...and the SVG itself is presentational and not focusable.
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("role", "presentation");
    expect(svg).toHaveAttribute("focusable", "false");

    // No labelled image, no baked-in text, nothing keyboard-reachable.
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("title")).toBeNull();
    expect(container.querySelector("text")).toBeNull();
    expect(container.querySelector("[tabindex]")).toBeNull();
  });

  it("carries no remote asset — everything is inline (privacy: no third-party request)", () => {
    const { container } = render(<HeroScene />);
    // No <img>, no <image>, and nothing pointing at an external URL.
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("image")).toBeNull();
    expect(container.querySelector("[src]")).toBeNull();
    const markup = container.innerHTML;
    expect(markup).not.toContain("http://");
    expect(markup).not.toContain("https://");
  });

  it("themes itself from design tokens (CSS custom properties)", () => {
    const { container } = render(<HeroScene />);
    const svgMarkup = container.querySelector("svg")!.innerHTML;
    expect(svgMarkup).toContain("var(--module-tint)");
    expect(svgMarkup).toContain("var(--llc-color-ink)");
  });

  it("lets the caller own layout via className while keeping the entrance class", () => {
    const { container } = render(<HeroScene className="max-w-md" />);
    const wrapper = container.firstElementChild!;
    expect(wrapper).toHaveClass("max-w-md");
    expect(wrapper).toHaveClass("llc-scene-enter");
  });
});
