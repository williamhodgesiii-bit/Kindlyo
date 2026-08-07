import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ParentAreaExit } from "./ParentAreaExit";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

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

beforeEach(() => push.mockClear());

describe("ParentAreaExit", () => {
  it("shows a button, not a one-tap link", () => {
    render(<ParentAreaExit label="For parents" />);
    expect(
      screen.getByRole("button", { name: "For parents" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "For parents" }),
    ).not.toBeInTheDocument();
  });

  it("opens the gate instead of leaving straight away", async () => {
    const user = userEvent.setup();
    render(<ParentAreaExit label="For parents" />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "For parents" }));

    expect(
      screen.getByRole("heading", { name: "Ask a grown-up" }),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("routes to the parent area once the gate is solved", async () => {
    const user = userEvent.setup();
    render(<ParentAreaExit label="For parents" href="/parent" />);

    await user.click(screen.getByRole("button", { name: "For parents" }));
    await user.type(screen.getByRole("textbox"), "12");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(push).toHaveBeenCalledWith("/parent");
  });

  it("does not leave when the gate is cancelled", async () => {
    const user = userEvent.setup();
    render(<ParentAreaExit label="For parents" />);

    await user.click(screen.getByRole("button", { name: "For parents" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(push).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
