import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
  it("points at the main content landmark", () => {
    render(<SkipLink />);
    expect(
      screen.getByRole("link", { name: "Skip to main content" }),
    ).toHaveAttribute("href", "#main-content");
  });

  it("is the first element reachable by keyboard", async () => {
    const user = userEvent.setup();
    render(<SkipLink />);

    await user.tab();

    expect(
      screen.getByRole("link", { name: "Skip to main content" }),
    ).toHaveFocus();
  });

  it("stays in the accessibility tree while visually hidden", () => {
    render(<SkipLink />);
    // sr-only hides it visually; display:none would drop it from the tab order.
    expect(
      screen.getByRole("link", { name: "Skip to main content" }),
    ).toBeInTheDocument();
  });
});
