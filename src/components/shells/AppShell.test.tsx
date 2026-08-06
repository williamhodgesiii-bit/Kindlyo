import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChildAppShell } from "./ChildAppShell";
import { ParentAppShell } from "./ParentAppShell";

// ChildAppShell renders the BottomNav, which reads the current path.
vi.mock("next/navigation", () => ({
  usePathname: () => "/learn",
}));

/**
 * The landmark contract, pinned at unit level.
 *
 * e2e/shell.spec.ts asserts one banner, one main, and one contentinfo per
 * page, and Playwright's strict mode throws on a duplicate. Catching a second
 * landmark here means it fails in `npm run test` in seconds rather than in a
 * full production e2e run.
 */
describe("ParentAppShell", () => {
  it("provides exactly one of each page landmark", () => {
    render(
      <ParentAppShell>
        <p>Page content</p>
      </ParentAppShell>,
    );

    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
  });

  it("gives the skip link something to target", () => {
    render(
      <ParentAppShell>
        <p>Page content</p>
      </ParentAppShell>,
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("keeps the full site navigation", () => {
    render(
      <ParentAppShell>
        <p>Page content</p>
      </ParentAppShell>,
    );
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
  });
});

describe("ChildAppShell", () => {
  it("provides exactly one of each page landmark", () => {
    render(
      <ChildAppShell>
        <p>Lesson content</p>
      </ChildAppShell>,
    );

    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
  });

  it("gives the skip link something to target", () => {
    render(
      <ChildAppShell>
        <p>Lesson content</p>
      </ChildAppShell>,
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("keeps a visible way for an adult to reach their own area", () => {
    // e2e/shell.spec.ts navigates to the parent area from inside /learn, and
    // an adult sitting beside the child needs the exit anyway.
    render(
      <ChildAppShell>
        <p>Lesson content</p>
      </ChildAppShell>,
    );

    expect(screen.getByRole("link", { name: "For parents" })).toHaveAttribute(
      "href",
      "/parent",
    );
  });

  it("gives the child the Clubhouse / Map / Me bottom navigation", () => {
    // The design gives the child area a persistent bottom nav
    // (docs/design/COMPONENT_STATES.md §02) — the one menu that belongs here.
    render(
      <ChildAppShell>
        <p>Lesson content</p>
      </ChildAppShell>,
    );

    const nav = screen.getByRole("navigation", { name: "Learning area" });
    expect(nav).toBeInTheDocument();
    for (const label of ["Clubhouse", "Map", "Me"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("themes the surface when given a module id", () => {
    const { container } = render(
      <ChildAppShell moduleId="hello-garden">
        <p>Lesson content</p>
      </ChildAppShell>,
    );
    expect(
      container.querySelector('[data-module="hello-garden"]'),
    ).toBeInTheDocument();
  });
});
