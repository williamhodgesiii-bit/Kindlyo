import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentStatusBadge } from "./ContentStatusBadge";

describe("ContentStatusBadge", () => {
  it("names the status in text, not by colour alone", () => {
    render(<ContentStatusBadge status="draft" />);

    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("explains what draft means to a screen reader", () => {
    render(<ContentStatusBadge status="draft" />);

    expect(
      screen.getByText(/not yet reviewed by a qualified human/),
    ).toBeInTheDocument();
  });

  it("can show the explanation visibly", () => {
    render(<ContentStatusBadge status="published" withDescription />);

    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(
      screen.getByText("Reviewed and published content."),
    ).toBeInTheDocument();
  });

  it("never claims review that has not happened", () => {
    render(<ContentStatusBadge status="draft" withDescription />);

    expect(screen.queryByText(/^Reviewed/)).not.toBeInTheDocument();
  });
});
