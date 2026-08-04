import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "./IconButton";
import { CloseIcon } from "./icons";

describe("IconButton", () => {
  it("uses its label as the accessible name", () => {
    render(<IconButton label="Close" icon={<CloseIcon />} />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("keeps the icon out of the accessibility tree", () => {
    const { container } = render(
      <IconButton label="Close" icon={<CloseIcon />} />,
    );

    // The glyph carries no meaning of its own; the label is the whole message.
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden");
  });

  it("is operable by keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton label="Close" icon={<CloseIcon />} onClick={onClick} />);

    await user.tab();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
