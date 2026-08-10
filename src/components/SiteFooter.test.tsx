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

  it("reaches the live product surfaces", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: "Learning app" })).toHaveAttribute(
      "href",
      "/learn",
    );
    expect(
      screen.getByRole("link", { name: "Parent dashboard" }),
    ).toHaveAttribute("href", "/parent");
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/login",
    );
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
