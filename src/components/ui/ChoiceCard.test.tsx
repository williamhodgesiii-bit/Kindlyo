import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChoiceCard, ChoiceList } from "./ChoiceCard";

describe("ChoiceCard", () => {
  it("reports its selected state without relying on colour", () => {
    render(
      <ChoiceList label="What could you do?">
        <ChoiceCard label="Wave and say hello" selected />
        <ChoiceCard label="Wait nearby" />
      </ChoiceList>,
    );

    expect(
      screen.getByRole("button", { name: /Wave and say hello/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Wait nearby/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls back when a choice is chosen", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ChoiceList label="What could you do?">
        <ChoiceCard label="Wave and say hello" onClick={onClick} />
      </ChoiceList>,
    );

    await user.click(
      screen.getByRole("button", { name: /Wave and say hello/ }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("reaches every choice by keyboard and activates with the keyboard", async () => {
    const user = userEvent.setup();
    const onSecond = vi.fn();
    render(
      <ChoiceList label="What could you do?">
        <ChoiceCard label="First choice" />
        <ChoiceCard label="Second choice" onClick={onSecond} />
      </ChoiceList>,
    );

    await user.tab();
    expect(screen.getByRole("button", { name: /First choice/ })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /Second choice/ })).toHaveFocus();

    await user.keyboard(" ");
    expect(onSecond).toHaveBeenCalledTimes(1);
  });

  it("cannot be chosen while disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ChoiceList label="What could you do?">
        <ChoiceCard label="Not available yet" disabled onClick={onClick} />
      </ChoiceList>,
    );

    await user.click(screen.getByRole("button", { name: /Not available yet/ }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("exposes the choices as a labelled list", () => {
    render(
      <ChoiceList label="What could you do?">
        <ChoiceCard label="Wave and say hello" />
      </ChoiceList>,
    );

    expect(
      screen.getByRole("list", { name: "What could you do?" }),
    ).toBeInTheDocument();
  });

  it("never renders correctness wording", () => {
    // Guard rail for docs/CURRICULUM_PRINCIPLES.md: a child's choice is never
    // scored. If someone adds a `correct` prop, this should start failing.
    const { container } = render(
      <ChoiceList label="What could you do?">
        <ChoiceCard label="Wave and say hello" selected />
      </ChoiceList>,
    );

    expect(container.textContent).not.toMatch(
      /correct|incorrect|wrong|right answer/i,
    );
  });
});
