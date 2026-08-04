import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("announces that something is loading, exactly once", () => {
    render(<Skeleton variant="text" lines={4} />);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Loading");
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("keeps the placeholder bars out of the accessibility tree", () => {
    // Reading out a row of grey boxes helps nobody.
    const { container } = render(<Skeleton variant="text" lines={3} />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("renders the number of lines it was asked for", () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const bars = container.querySelectorAll("[aria-hidden='true'] > span");
    expect(bars).toHaveLength(3);
  });

  it("never renders fewer than one bar", () => {
    const { container } = render(<Skeleton variant="text" lines={0} />);
    expect(
      container.querySelectorAll("[aria-hidden='true'] > span"),
    ).toHaveLength(1);
  });

  it("keeps the circle variant circular", () => {
    // Regression: a `w-full` from the line-width logic used to collide with
    // the circle's own `w-11`, and stylesheet order decided the winner.
    const { container } = render(<Skeleton variant="circle" />);
    const bar = container.querySelector("[aria-hidden='true'] > span");

    expect(bar).toHaveClass("w-11");
    expect(bar).not.toHaveClass("w-full");
  });

  it("lets the caller name what is loading", () => {
    render(<Skeleton loadingLabel="Loading missions" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading missions");
  });
});
