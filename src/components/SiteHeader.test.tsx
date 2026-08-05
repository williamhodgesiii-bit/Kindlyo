import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./SiteHeader";

/**
 * The header renders its links twice — once as a row for wide viewports, once
 * inside the narrow-viewport disclosure — and CSS decides which copy is shown.
 * jsdom loads no CSS, so both are present here and these tests use
 * `getAllByRole`. In a real browser only one copy is ever displayed, which is
 * what e2e/marketing.spec.ts checks.
 */
describe("SiteHeader", () => {
  it("renders exactly one labelled navigation landmark", () => {
    render(<SiteHeader />);
    expect(screen.getAllByRole("navigation", { name: "Main" })).toHaveLength(1);
  });

  it("links to every marketing page", () => {
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Main" });

    const expected = [
      ["How it works", "/how-it-works"],
      ["Curriculum", "/curriculum"],
      ["For parents", "/for-parents"],
      ["Safety", "/safety"],
      ["Pricing", "/pricing"],
    ] as const;

    for (const [label, href] of expected) {
      const links = within(nav).getAllByRole("link", { name: label });
      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        expect(link).toHaveAttribute("href", href);
      }
    }
  });

  it("sends 'For parents' to the marketing page, not the parent area", () => {
    // The two are easy to confuse and the distinction is load-bearing: /parent
    // is the product, /for-parents explains it. The footer carries the other.
    render(<SiteHeader />);
    for (const link of screen.getAllByRole("link", { name: "For parents" })) {
      expect(link).toHaveAttribute("href", "/for-parents");
    }
  });

  it("offers the waitlist from every page", () => {
    render(<SiteHeader />);
    expect(
      screen.getByRole("link", { name: "Join the waitlist" }),
    ).toHaveAttribute("href", "/waitlist");
  });

  it("says the product is in private beta", () => {
    render(<SiteHeader />);
    expect(screen.getByText("Private beta")).toBeInTheDocument();
  });

  it("reaches the wordmark and the first navigation link by keyboard", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.tab();
    expect(screen.getByRole("link", { name: "Kindlyo" })).toHaveFocus();

    await user.tab();
    const [firstNavLink] = screen.getAllByRole("link", {
      name: "How it works",
    });
    expect(firstNavLink).toHaveFocus();
  });

  it("puts the narrow-viewport menu behind a closed native disclosure", () => {
    // jsdom does not implement <summary> activation, so whether it actually
    // opens is checked in e2e/marketing.spec.ts against a real browser. What
    // matters here is that the markup is a real <details> — that is what buys
    // the keyboard behaviour and the no-JavaScript fallback.
    render(<SiteHeader />);

    const disclosure = screen.getByText("Menu").closest("details");
    expect(disclosure).not.toBeNull();
    expect(disclosure).not.toHaveAttribute("open");
    expect(disclosure?.querySelector("summary")).not.toBeNull();
    expect(
      within(disclosure as HTMLElement).getByRole("link", { name: "Pricing" }),
    ).toBeInTheDocument();
  });
});
