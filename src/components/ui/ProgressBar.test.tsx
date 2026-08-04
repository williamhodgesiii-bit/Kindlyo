import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("exposes its position to assistive technology", () => {
    render(<ProgressBar label="Module progress" value={3} max={8} />);

    const bar = screen.getByRole("progressbar", { name: "Module progress" });
    expect(bar).toHaveAttribute("aria-valuenow", "3");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "8");
    expect(bar).toHaveAttribute("aria-valuetext", "3 of 8");
  });

  it("shows the count as visible text, not only as a filled bar", () => {
    // Progress must never be communicated by width or colour alone.
    render(<ProgressBar label="Module progress" value={3} max={8} />);
    expect(screen.getByText("3 of 8")).toBeInTheDocument();
  });

  it("clamps a value that falls outside the range", () => {
    const { rerender } = render(
      <ProgressBar label="Module progress" value={99} max={8} />,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "8",
    );

    rerender(<ProgressBar label="Module progress" value={-4} max={8} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  });

  it("survives a zero maximum without producing NaN", () => {
    render(<ProgressBar label="Module progress" value={0} max={0} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuemax",
      "1",
    );
  });

  it("can hide the count when a caller shows it elsewhere", () => {
    render(
      <ProgressBar
        label="Module progress"
        value={3}
        max={8}
        showCount={false}
      />,
    );

    expect(screen.queryByText("3 of 8")).not.toBeInTheDocument();
    // The value is still available to screen readers.
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "3 of 8",
    );
  });
});
