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

describe("drawn avatars", () => {
  it("renders the chosen drawing instead of the initial", () => {
    render(<Avatar nickname="Ada" avatarId="fox" />);

    const avatar = screen.getByRole("img", { name: "Ada" });
    expect(avatar.querySelector("svg")).toBeInTheDocument();
    expect(avatar).not.toHaveTextContent("A");
  });

  it("still has no image element and no src, whatever is chosen", () => {
    const { container } = render(<Avatar nickname="Ada" avatarId="star" />);

    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("[src]")).toBeNull();
  });

  it("falls back to the initial when no avatar is chosen", () => {
    render(<Avatar nickname="Ada" />);

    expect(screen.getByRole("img", { name: "Ada" })).toHaveTextContent("A");
  });

  it("keeps the nickname as the accessible name, not the drawing", () => {
    render(<Avatar nickname="Ada" avatarId="boat" />);

    expect(screen.getByRole("img", { name: "Ada" })).toBeInTheDocument();
    expect(screen.queryByText("Boat")).toBeNull();
  });
});
