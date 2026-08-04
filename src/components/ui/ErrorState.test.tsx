import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("offers a retry that calls back", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState title="We could not load progress" onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("interrupts only when the failure just happened", () => {
    const { rerender } = render(<ErrorState title="Something went wrong" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    // A statically rendered error page should not shout on every navigation;
    // an error raised in response to an action should.
    rerender(<ErrorState live title="Something went wrong" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders its heading at the level the page asks for", () => {
    render(<ErrorState headingLevel={1} title="Something went wrong" />);
    expect(
      screen.getByRole("heading", { name: "Something went wrong", level: 1 }),
    ).toBeInTheDocument();
  });

  it("shows no retry button when there is nothing to retry", () => {
    render(<ErrorState title="Something went wrong" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("renders its heading at the level the page asks for", () => {
    render(<EmptyState headingLevel={3} title="No missions yet" />);
    expect(
      screen.getByRole("heading", { name: "No missions yet", level: 3 }),
    ).toBeInTheDocument();
  });

  it("renders the caller's action", () => {
    render(
      <EmptyState title="No missions yet" action={<button>Browse</button>} />,
    );
    expect(screen.getByRole("button", { name: "Browse" })).toBeInTheDocument();
  });
});
