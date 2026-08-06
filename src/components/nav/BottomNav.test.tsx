import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BottomNav } from "./BottomNav";

const usePathname = vi.fn<() => string>();
vi.mock("next/navigation", () => ({
  usePathname: () => usePathname(),
}));

describe("BottomNav", () => {
  beforeEach(() => usePathname.mockReturnValue("/learn"));

  it("offers the three learning-area destinations with labels", () => {
    render(<BottomNav />);
    const nav = screen.getByRole("navigation", { name: "Learning area" });
    expect(nav).toBeInTheDocument();

    for (const [label, href] of [
      ["Clubhouse", "/learn"],
      ["Map", "/learn/map"],
      ["Me", "/learn/me"],
    ] as const) {
      // A visible text label, not icon-only (DESIGN.md §5).
      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href,
      );
    }
  });

  it("marks the current destination and only that one", () => {
    usePathname.mockReturnValue("/learn/map");
    render(<BottomNav />);

    expect(screen.getByRole("link", { name: "Map" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Clubhouse" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("link", { name: "Me" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("keeps Clubhouse current while inside a lesson", () => {
    usePathname.mockReturnValue("/learn/lesson/saying-hello");
    render(<BottomNav />);

    expect(screen.getByRole("link", { name: "Clubhouse" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Map" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
