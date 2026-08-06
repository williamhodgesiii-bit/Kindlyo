import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LessonLoading } from "./LessonLoading";

describe("LessonLoading", () => {
  it("announces the wait once, politely", () => {
    render(<LessonLoading label="Getting Hello Garden ready…" />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Getting Hello Garden ready…");
  });

  it("hides the skeleton bars from assistive tech", () => {
    const { container } = render(<LessonLoading />);
    // Exactly one status region — the friendly line — not one per skeleton.
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
