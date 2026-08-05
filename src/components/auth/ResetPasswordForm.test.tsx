import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { navigateTo } from "./navigate";
import { ResetPasswordForm } from "./ResetPasswordForm";

vi.mock("./navigate", () => ({ navigateTo: vi.fn() }));

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

describe("ResetPasswordForm", () => {
  it("rejects a password below the minimum length", async () => {
    const user = userEvent.setup();
    const fetchSpy = mockFetch({
      ok: true,
      status: 200,
      json: () => ({ ok: true }),
    });
    render(<ResetPasswordForm />);

    await user.type(screen.getByLabelText("New password"), "short");
    await user.type(screen.getByLabelText("Confirm new password"), "short");
    await user.click(screen.getByRole("button", { name: "Save new password" }));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(await screen.findByRole("alert")).toHaveTextContent(/at least 8/i);
  });

  it("requires the two passwords to match", async () => {
    const user = userEvent.setup();
    const fetchSpy = mockFetch({
      ok: true,
      status: 200,
      json: () => ({ ok: true }),
    });
    render(<ResetPasswordForm />);

    await user.type(screen.getByLabelText("New password"), "longenough1");
    await user.type(
      screen.getByLabelText("Confirm new password"),
      "longenough2",
    );
    await user.click(screen.getByRole("button", { name: "Save new password" }));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(await screen.findByRole("alert")).toHaveTextContent(/do not match/i);
  });

  it("saves a valid, matching password and navigates on", async () => {
    const user = userEvent.setup();
    mockFetch({
      ok: true,
      status: 200,
      json: () => ({ ok: true, next: "/parent" }),
    });
    render(<ResetPasswordForm />);

    await user.type(screen.getByLabelText("New password"), "longenough1");
    await user.type(
      screen.getByLabelText("Confirm new password"),
      "longenough1",
    );
    await user.click(screen.getByRole("button", { name: "Save new password" }));

    await waitFor(() => expect(navigateTo).toHaveBeenCalledWith("/parent"));
  });
});
