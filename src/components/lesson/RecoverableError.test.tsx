import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RecoverableError } from "./RecoverableError";

describe("RecoverableError", () => {
  it("announces calmly, because it follows a user action", () => {
    render(<RecoverableError onRetry={vi.fn()} />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("That part didn’t load");
  });

  it("never blames the reader", () => {
    render(<RecoverableError onRetry={vi.fn()} />);
    expect(
      screen.queryByText(/error|wrong|failed|invalid|✕/i),
    ).not.toBeInTheDocument();
  });

  it("retries in place and keeps a calm way home", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<RecoverableError onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();

    expect(
      screen.getByRole("link", { name: "Back to the clubhouse" }),
    ).toHaveAttribute("href", "/learn");
  });
});
