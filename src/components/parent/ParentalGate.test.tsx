import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { ParentalGate } from "./ParentalGate";

// Pin the puzzle so the tests know the answer; isAnswerCorrect stays real.
vi.mock("@/features/parental-gate/puzzle", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/parental-gate/puzzle")>();
  return {
    ...actual,
    createGatePuzzle: () => ({
      a: 7,
      b: 5,
      answer: 12,
      question: "What is seven plus five?",
    }),
  };
});

function renderGate(
  overrides: Partial<ComponentProps<typeof ParentalGate>> = {},
) {
  const onCancel = vi.fn();
  const onVerified = vi.fn();
  render(
    <ParentalGate
      open
      purpose="return"
      onCancel={onCancel}
      onVerified={onVerified}
      {...overrides}
    />,
  );
  return { onCancel, onVerified };
}

describe("ParentalGate", () => {
  it("renders nothing until it is opened", () => {
    renderGate({ open: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("asks a grown-up to answer a written sum", () => {
    renderGate();
    expect(
      screen.getByRole("heading", { name: "Ask a grown-up" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/What is seven plus five\?/)).toBeInTheDocument();
    // The sum is spelled out — never a tappable digit.
    expect(screen.getByText(/What is seven plus five\?/)).not.toHaveTextContent(
      /\d/,
    );
  });

  it("moves focus to the answer field", () => {
    renderGate();
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("keeps Continue disabled until the answer is right", async () => {
    const user = userEvent.setup();
    const { onVerified } = renderGate();

    const cont = screen.getByRole("button", { name: "Continue" });
    expect(cont).toBeDisabled();

    await user.type(screen.getByRole("textbox"), "11");
    expect(cont).toBeDisabled();

    await user.clear(screen.getByRole("textbox"));
    await user.type(screen.getByRole("textbox"), "12");
    expect(cont).toBeEnabled();

    await user.click(cont);
    expect(onVerified).toHaveBeenCalledTimes(1);
  });

  it("cancels without verifying", async () => {
    const user = userEvent.setup();
    const { onCancel, onVerified } = renderGate();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onVerified).not.toHaveBeenCalled();
  });

  it("describes the purchase gate in its own words", () => {
    renderGate({ purpose: "purchase" });
    expect(screen.getByText(/way to the payment page/)).toBeInTheDocument();
  });
});
