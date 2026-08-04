import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("shows the nickname's first letter and uses the nickname as its name", () => {
    render(<Avatar nickname="Robin" />);

    const avatar = screen.getByRole("img", { name: "Robin" });
    expect(avatar).toHaveTextContent("R");
  });

  it("falls back to a neutral marker when there is no nickname yet", () => {
    render(<Avatar />);
    expect(screen.getByRole("img", { name: "Profile" })).toBeInTheDocument();
  });

  it("treats a blank nickname as no nickname", () => {
    render(<Avatar nickname="   " />);
    expect(screen.getByRole("img", { name: "Profile" })).toBeInTheDocument();
  });

  it("handles a nickname that starts with an emoji", () => {
    // Counting by code point rather than by UTF-16 unit keeps a surrogate
    // pair intact instead of rendering half a character.
    render(<Avatar nickname="🦊 Fox" />);
    expect(screen.getByRole("img", { name: "🦊 Fox" })).toHaveTextContent("🦊");
  });

  it("leaves the accessibility tree when the nickname is already visible", () => {
    render(<Avatar nickname="Robin" decorative />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("gives the same nickname the same tint every time", () => {
    const { container: first } = render(<Avatar nickname="Robin" />);
    const { container: second } = render(<Avatar nickname="Robin" />);

    expect(first.firstElementChild?.className).toBe(
      second.firstElementChild?.className,
    );
  });
});
