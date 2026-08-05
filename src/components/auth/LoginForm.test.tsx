import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "./LoginForm";
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

describe("LoginForm", () => {
  it("asks for an email and a password", () => {
    render(<LoginForm redirectTo="/parent" />);
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("does not submit a malformed email", async () => {
    const user = userEvent.setup();
    const fetchSpy = mockFetch({
      ok: true,
      status: 200,
      json: () => ({ ok: true }),
    });
    render(<LoginForm redirectTo="/parent" />);

    await user.type(screen.getByLabelText("Email address"), "nope");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /does not look like an email/i,
    );
  });

  it("posts credentials with the redirect target and navigates on success", async () => {
    const user = userEvent.setup();
    const fetchSpy = mockFetch({
      ok: true,
      status: 200,
      json: () => ({ ok: true, next: "/parent" }),
    });
    render(<LoginForm redirectTo="/parent" />);

    await user.type(
      screen.getByLabelText("Email address"),
      "parent@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(navigateTo).toHaveBeenCalledWith("/parent"));
    const [url] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/api/auth/signin");
    expect(url).toContain("redirectTo=%2Fparent");
  });

  it("shows the generic failure and does not navigate when the server rejects", async () => {
    const user = userEvent.setup();
    mockFetch({
      ok: false,
      status: 401,
      json: () => ({
        ok: false,
        issues: ["Those sign-in details did not match."],
      }),
    });
    render(<LoginForm redirectTo="/parent" />);

    await user.type(
      screen.getByLabelText("Email address"),
      "parent@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "wrongpass");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /did not match/i,
    );
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it("links to the password reset flow", () => {
    render(<LoginForm redirectTo="/parent" />);
    expect(
      screen.getByRole("link", { name: /forgot your password/i }),
    ).toHaveAttribute("href", "/forgot-password");
  });
});
