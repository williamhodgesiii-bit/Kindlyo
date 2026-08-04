import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChildAppShell } from "./ChildAppShell";
import { ParentAppShell } from "./ParentAppShell";

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

  it("does not offer the child a menu of somewhere else to be", () => {
    render(
      <ChildAppShell>
        <p>Lesson content</p>
      </ChildAppShell>,
    );
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
