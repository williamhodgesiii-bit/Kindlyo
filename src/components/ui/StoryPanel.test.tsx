import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StoryPanel } from "./StoryPanel";

describe("StoryPanel", () => {
  it("renders the title and narration", () => {
    render(<StoryPanel title="The opening" narration="Something happens." />);

    expect(
      screen.getByRole("heading", { name: "The opening" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Something happens.")).toBeInTheDocument();
  });

  it("reads the same with no illustration, because the picture is decorative", () => {
    const { rerender } = render(
      <StoryPanel title="The opening" narration="Something happens." />,
    );
    const withoutArt = screen.getByRole("article").textContent;

    rerender(
      <StoryPanel
        title="The opening"
        narration="Something happens."
        illustration={<svg data-testid="art" />}
      />,
    );

    expect(screen.getByRole("article").textContent).toBe(withoutArt);
  });

  it("takes a caller-controlled heading level so outlines never skip", () => {
    render(
      <StoryPanel
        title="The opening"
        narration="Something happens."
        headingLevel={3}
      />,
    );

    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("renders extra content below the narration", () => {
    render(
      <StoryPanel title="The opening" narration="Something happens.">
        <p>What could you do?</p>
      </StoryPanel>,
    );

    expect(screen.getByText("What could you do?")).toBeInTheDocument();
  });
});
