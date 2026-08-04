import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProfileCard } from "./ProfileCard";

describe("ProfileCard", () => {
  it("shows the nickname and age band", () => {
    render(<ProfileCard nickname="Robin" ageBand="Ages 5 to 6" />);

    expect(screen.getByRole("heading", { name: "Robin" })).toBeInTheDocument();
    expect(screen.getByText("Ages 5 to 6")).toBeInTheDocument();
  });

  it("becomes a button that can be chosen by keyboard", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ProfileCard nickname="Robin" onSelect={onSelect} />);

    await user.tab();
    const card = screen.getByRole("button", { name: /Robin/ });
    expect(card).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("reports selection without relying on colour", () => {
    render(<ProfileCard nickname="Robin" onSelect={vi.fn()} selected />);

    const card = screen.getByRole("button", { name: /Robin/ });
    expect(card).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Selected")).toBeInTheDocument();
  });

  it("becomes a link when given a destination", () => {
    render(<ProfileCard nickname="Robin" href="/learn" />);

    expect(screen.getByRole("link", { name: /Robin/ })).toHaveAttribute(
      "href",
      "/learn",
    );
  });

  it("is not interactive when it is only information", () => {
    render(<ProfileCard nickname="Robin" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("has no way to show a photograph or a real name", () => {
    // Enforced by the prop type; asserted here so a future `src` prop has to
    // break a test that explains why (docs/PRIVACY_AND_SAFETY.md).
    const { container } = render(<ProfileCard nickname="Robin" />);
    expect(container.querySelector("img")).toBeNull();
  });
});
