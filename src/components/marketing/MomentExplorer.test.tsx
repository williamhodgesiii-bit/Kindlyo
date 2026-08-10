import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { neighborhoodWorlds } from "@/content/worlds";
import { MomentExplorer } from "./MomentExplorer";

/**
 * The homepage centrepiece is interactive, so the things worth testing are the
 * things a mouse-free or screen-reader visitor depends on: real radio-group
 * semantics, the caption that carries meaning the decorative scene cannot, and
 * that no illustration is ever exposed as content. It renders against the real
 * worlds list, so dropping or renaming a world surfaces here.
 */
describe("MomentExplorer", () => {
  it("offers one radio per world, with the first selected by default", () => {
    render(<MomentExplorer />);

    const group = screen.getByRole("radiogroup", { name: /choose a place/i });
    expect(within(group).getAllByRole("radio")).toHaveLength(
      neighborhoodWorlds.length,
    );

    const first = neighborhoodWorlds[0]!;
    expect(screen.getByRole("radio", { name: first.title })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(
      screen.getByText(new RegExp(first.teaches, "i")),
    ).toBeInTheDocument();
  });

  it("shows the chosen world's own child-facing line", async () => {
    const user = userEvent.setup();
    render(<MomentExplorer />);

    const first = neighborhoodWorlds[0]!;
    const other = neighborhoodWorlds[3]!;

    await user.click(screen.getByRole("radio", { name: other.title }));

    expect(screen.getByRole("radio", { name: other.title })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: first.title })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(
      screen.getByText(new RegExp(other.teaches, "i")),
    ).toBeInTheDocument();
  });

  it("moves the selection with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<MomentExplorer />);

    const first = neighborhoodWorlds[0]!;
    const second = neighborhoodWorlds[1]!;

    screen.getByRole("radio", { name: first.title }).focus();
    await user.keyboard("{ArrowRight}");

    const secondRadio = screen.getByRole("radio", { name: second.title });
    expect(secondRadio).toHaveAttribute("aria-checked", "true");
    expect(secondRadio).toHaveFocus();
  });

  it("keeps the illustration decorative and never exposes it as content", () => {
    const { container } = render(<MomentExplorer />);

    // The scene stage renders an aria-hidden wrapper; nothing is an image.
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
  });
});
