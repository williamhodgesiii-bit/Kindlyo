import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ParentInsightCard } from "./ParentInsightCard";

describe("ParentInsightCard", () => {
  it("says who it is for", () => {
    render(<ParentInsightCard title="How to help" body="Model it once." />);

    expect(screen.getByText("For grown-ups")).toBeInTheDocument();
  });

  it("renders suggestions as a list", () => {
    render(
      <ParentInsightCard
        title="How to help"
        body="Model it once."
        points={["Go first yourself.", "Let them pick the form."]}
      />,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("omits the list when there is nothing in it", () => {
    render(
      <ParentInsightCard
        title="How to help"
        body="Model it once."
        points={[]}
      />,
    );

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("is a labelled region a parent can find", () => {
    render(<ParentInsightCard title="How to help" body="Model it once." />);

    expect(
      screen.getByRole("heading", { name: "How to help" }),
    ).toBeInTheDocument();
  });

  it("takes a caller-controlled heading level", () => {
    render(
      <ParentInsightCard
        title="How to help"
        body="Model it once."
        headingLevel={4}
      />,
    );

    expect(screen.getByRole("heading", { level: 4 })).toBeInTheDocument();
  });
});
