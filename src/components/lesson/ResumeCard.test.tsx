import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ResumeCard } from "./ResumeCard";

function renderCard(overrides: Partial<Parameters<typeof ResumeCard>[0]> = {}) {
  const onKeepGoing = vi.fn();
  const onStartOver = vi.fn();
  render(
    <ResumeCard
      lessonTitle="Saying hello"
      stepNumber={3}
      stepCount={7}
      onKeepGoing={onKeepGoing}
      onStartOver={onStartOver}
      {...overrides}
    />,
  );
  return { onKeepGoing, onStartOver };
}

describe("ResumeCard", () => {
  it("names the saved place in plain words", () => {
    renderCard();
    expect(
      screen.getByRole("heading", { level: 1, name: "Welcome back" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/step 3 of 7/i)).toBeInTheDocument();
  });

  it("offers two equal choices and decides nothing on its own", async () => {
    const user = userEvent.setup();
    const { onKeepGoing, onStartOver } = renderCard();

    await user.click(screen.getByRole("button", { name: "Keep going" }));
    expect(onKeepGoing).toHaveBeenCalledOnce();
    expect(onStartOver).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Start over" }));
    expect(onStartOver).toHaveBeenCalledOnce();
  });
});
