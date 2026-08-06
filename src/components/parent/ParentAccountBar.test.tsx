import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ParentAccountBar } from "./ParentAccountBar";

describe("ParentAccountBar", () => {
  it("shows which account is signed in", () => {
    render(<ParentAccountBar email="parent@example.com" />);
    expect(screen.getByText("parent@example.com")).toBeInTheDocument();
  });

  it("signs out with a real form POST to the sign-out route", () => {
    const { container } = render(
      <ParentAccountBar email="parent@example.com" />,
    );

    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    expect(form).toHaveAttribute("action", "/auth/signout");
    expect(form).toHaveAttribute("method", "post");

    expect(screen.getByRole("button", { name: "Sign out" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("links to the family membership page", () => {
    render(<ParentAccountBar email="parent@example.com" />);
    expect(screen.getByRole("link", { name: "Membership" })).toHaveAttribute(
      "href",
      "/parent/billing",
    );
  });
});
