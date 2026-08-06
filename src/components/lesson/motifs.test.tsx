import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MotifShape, motifPath, motifPaths } from "./motifs";

describe("motifPath", () => {
  it("returns the shape for a known motif", () => {
    expect(motifPath("petal")).toBe(motifPaths.petal);
  });

  it("falls back to the neutral shape for an unknown motif", () => {
    expect(motifPath("no-such-motif")).toBe(motifPaths.default);
  });
});

describe("MotifShape", () => {
  it("renders a decorative shape that inherits its colour", () => {
    const { container } = render(<MotifShape motif="petal" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    const path = container.querySelector("path");
    expect(path).toHaveAttribute("d", motifPaths.petal);
    expect(path).toHaveAttribute("fill", "currentColor");
  });
});
