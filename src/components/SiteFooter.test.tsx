import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("reaches the legal placeholders", () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole("link", { name: "Privacy policy" }),
    ).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms of use" })).toHaveAttribute(
      "href",
      "/terms",
    );
    expect(
      screen.getByRole("link", { name: "Safety and privacy" }),
    ).toHaveAttribute("href", "/safety");
  });

  it("labels the product surfaces as previews rather than the real thing", () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole("link", { name: "Learning area preview" }),
    ).toHaveAttribute("href", "/learn");
    expect(
      screen.getByRole("link", { name: "Parent area preview" }),
    ).toHaveAttribute("href", "/parent");
  });

  it("keeps the draft-content notice", () => {
    // A product requirement, not decoration: we must never imply review that
    // has not happened (CLAUDE.md, "Content status").
    render(<SiteFooter />);
    expect(screen.getByText(/draft content/i)).toBeInTheDocument();
    expect(screen.getByText(/private beta/i)).toBeInTheDocument();
  });

  it("offers the child surface no onward navigation", () => {
    // ChildAppShell passes navigation={false}; a child working through a
    // scenario should not be shown a pricing link.
    render(<SiteFooter navigation={false} />);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/draft content/i)).toBeInTheDocument();
  });
});
