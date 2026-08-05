import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SignupForm } from "./SignupForm";
import { navigateTo } from "./navigate";

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

describe("SignupForm", () => {
  it("does not submit a password below the minimum length", async () => {
    const user = userEvent.setup();
    const fetchSpy = mockFetch({
      ok: true,
      status: 200,
      json: () => ({ ok: true }),
    });
    render(<SignupForm redirectTo="/parent" />);

    await user.type(
      screen.getByLabelText("Your email address"),
      "parent@example.com",
    );
    await user.type(screen.getByLabelText("Choose a password"), "short");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(await screen.findByRole("alert")).toHaveTextContent(/at least 8/i);
  });

  it("navigates on when a session is established", async () => {
    const user = userEvent.setup();
    mockFetch({
      ok: true,
      status: 200,
      json: () => ({ ok: true, next: "/parent", confirmEmail: false }),
    });
    render(<SignupForm redirectTo="/parent" />);

    await user.type(
      screen.getByLabelText("Your email address"),
      "parent@example.com",
    );
    await user.type(screen.getByLabelText("Choose a password"), "longenough1");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => expect(navigateTo).toHaveBeenCalledWith("/parent"));
  });

  it("asks the parent to check their inbox when confirmation is required", async () => {
    const user = userEvent.setup();
    mockFetch({
      ok: true,
      status: 200,
      json: () => ({ ok: true, confirmEmail: true }),
    });
    render(<SignupForm redirectTo="/parent" />);

    await user.type(
      screen.getByLabelText("Your email address"),
      "parent@example.com",
    );
    await user.type(screen.getByLabelText("Choose a password"), "longenough1");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText(/almost there/i)).toBeInTheDocument();
    expect(screen.getByText("parent@example.com")).toBeInTheDocument();
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it("shows the generic failure when sign-up is refused", async () => {
    const user = userEvent.setup();
    mockFetch({
      ok: false,
      status: 400,
      json: () => ({
        ok: false,
        issues: [
          "We could not create that account. Please check your details.",
        ],
      }),
    });
    render(<SignupForm redirectTo="/parent" />);

    await user.type(
      screen.getByLabelText("Your email address"),
      "parent@example.com",
    );
    await user.type(screen.getByLabelText("Choose a password"), "longenough1");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not create/i,
    );
  });
});
