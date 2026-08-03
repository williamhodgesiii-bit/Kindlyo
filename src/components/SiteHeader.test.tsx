import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("renders a labelled navigation landmark", () => {
    render(<SiteHeader />);
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
  });

  it("links to every top-level area", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Learn" })).toHaveAttribute(
      "href",
      "/learn",
    );
    expect(screen.getByRole("link", { name: "For parents" })).toHaveAttribute(
      "href",
      "/parent",
    );
  });

  it("reaches each navigation link by keyboard alone", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    // Wordmark first, then each nav link in visual order.
    await user.tab();
    expect(screen.getByRole("link", { name: "Kindlyo" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("link", { name: "Learn" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("link", { name: "For parents" })).toHaveFocus();
  });
});
