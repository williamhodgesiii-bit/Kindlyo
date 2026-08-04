import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import { MissionCard } from "./MissionCard";

describe("MissionCard", () => {
  it("renders its title at the heading level the page asks for", () => {
    render(
      <MissionCard
        title="Say hello to one new person"
        description="Somewhere you both already are."
        headingLevel={2}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Say hello to one new person",
        level: 2,
      }),
    ).toBeInTheDocument();
  });

  it("labels its status in words, not only in colour", () => {
    render(
      <MissionCard title="A mission" description="Details." status="done" />,
    );
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("lets the caller override the status wording", () => {
    render(
      <MissionCard
        title="A mission"
        description="Details."
        status="in-progress"
        statusLabel="Trying it this week"
      />,
    );
    expect(screen.getByText("Trying it this week")).toBeInTheDocument();
  });

  it("runs the caller's action", async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(
      <MissionCard
        title="A mission"
        description="Details."
        action={<Button onClick={onDone}>We tried it</Button>}
      />,
    );

    await user.click(screen.getByRole("button", { name: "We tried it" }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("shows no status chrome when the caller gives no status", () => {
    render(<MissionCard title="A mission" description="Details." />);

    expect(screen.queryByText("Suggested")).not.toBeInTheDocument();
    expect(screen.queryByText("Done")).not.toBeInTheDocument();
  });

  it("awards nothing", () => {
    // docs/DESIGN_SYSTEM.md rules out badges, points, and streak pressure.
    const { container } = render(
      <MissionCard title="A mission" description="Details." status="done" />,
    );
    expect(container.textContent).not.toMatch(/points?|streak|badge|score/i);
  });
});
