import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ParentNav } from "./ParentNav";

const usePathname = vi.fn<() => string>();
vi.mock("next/navigation", () => ({
  usePathname: () => usePathname(),
}));

describe("ParentNav", () => {
  beforeEach(() => usePathname.mockReturnValue("/parent"));

  it("offers the four parent sections with labels", () => {
    render(<ParentNav />);
    expect(
      screen.getByRole("navigation", { name: "Parent sections" }),
    ).toBeInTheDocument();

    for (const [label, href] of [
      ["Progress", "/parent"],
      ["Missions", "/parent/missions"],
      ["Skills", "/parent/skills"],
      ["Account", "/parent/account"],
    ] as const) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href,
      );
    }
  });

  it("marks Progress current only on the dashboard root", () => {
    usePathname.mockReturnValue("/parent");
    render(<ParentNav />);
    expect(screen.getByRole("link", { name: "Progress" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("does not mark Progress current inside a section", () => {
    usePathname.mockReturnValue("/parent/missions");
    render(<ParentNav />);
    expect(screen.getByRole("link", { name: "Progress" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("link", { name: "Missions" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("keeps Account current on the membership/billing page", () => {
    usePathname.mockReturnValue("/parent/billing");
    render(<ParentNav />);
    expect(screen.getByRole("link", { name: "Account" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
