import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

type FakeResponse = { ok: boolean; status: number; json: () => unknown };

function mockFetch(response: FakeResponse) {
  const spy = vi.fn(() => Promise.resolve(response as unknown as Response));
  vi.stubGlobal("fetch", spy);
  return spy;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("ForgotPasswordForm", () => {
  it("does not send a malformed address", async () => {
    const user = userEvent.setup();
    const fetchSpy = mockFetch({
      ok: true,
      status: 200,
      json: () => ({ ok: true }),
    });
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText("Email address"), "nope");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /does not look like an email/i,
    );
  });

  it("shows the same neutral confirmation on success", async () => {
    const user = userEvent.setup();
    mockFetch({ ok: true, status: 200, json: () => ({ ok: true }) });
    render(<ForgotPasswordForm />);

    await user.type(
      screen.getByLabelText("Email address"),
      "parent@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    // Never reveals whether the address has an account.
    expect(
      await screen.findByText(/if that email address has an account/i),
    ).toBeInTheDocument();
  });
});
