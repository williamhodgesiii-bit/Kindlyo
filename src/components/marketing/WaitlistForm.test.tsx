import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WaitlistForm } from "./WaitlistForm";

type FakeResponse = { ok: boolean; status: number; json: () => unknown };

function mockFetch(response: FakeResponse) {
  const spy = vi.fn(() => Promise.resolve(response as unknown as Response));
  vi.stubGlobal("fetch", spy);
  return spy;
}

function ok() {
  return mockFetch({ ok: true, status: 200, json: () => ({ ok: true }) });
}

describe("WaitlistForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("asks for one thing, and it is not a name", () => {
    render(<WaitlistForm />);

    const textboxes = screen.getAllByRole("textbox");
    expect(textboxes).toHaveLength(1);
    expect(textboxes[0]).toHaveAccessibleName("Your email address");
    expect(
      screen.queryByLabelText(/name|surname|birth|postcode|phone/i),
    ).toBeNull();
  });

  it("does not send a malformed address", async () => {
    const user = userEvent.setup();
    const fetchSpy = ok();
    render(<WaitlistForm />);

    await user.type(screen.getByLabelText("Your email address"), "not-email");
    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /does not look like an email address/i,
    );
  });

  it("does not send an empty form", async () => {
    const user = userEvent.setup();
    const fetchSpy = ok();
    render(<WaitlistForm />);

    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /enter an email address/i,
    );
  });

  it("posts a valid address and confirms", async () => {
    const user = userEvent.setup();
    const fetchSpy = ok();
    render(<WaitlistForm />);

    await user.type(
      screen.getByLabelText("Your email address"),
      "parent@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("/api/waitlist");
    expect(JSON.parse(String(init.body))).toEqual({
      email: "parent@example.com",
    });

    expect(await screen.findByText(/your address is recorded/i)).toBeVisible();
  });

  it("includes the age band only when one was chosen", async () => {
    const user = userEvent.setup();
    const fetchSpy = ok();
    render(<WaitlistForm />);

    await user.type(
      screen.getByLabelText("Your email address"),
      "parent@example.com",
    );
    await user.click(screen.getByRole("radio", { name: "Ages 7–9" }));
    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));

    const [, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(String(init.body))).toEqual({
      email: "parent@example.com",
      ageBand: "7–9",
    });
  });

  it("lets somebody decline to say how old their child is", () => {
    render(<WaitlistForm />);
    expect(screen.getByRole("radio", { name: "Rather not say" })).toBeChecked();
  });

  it("clears the field after a successful signup", async () => {
    const user = userEvent.setup();
    ok();
    render(<WaitlistForm />);

    const field = screen.getByLabelText("Your email address");
    await user.type(field, "parent@example.com");
    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));

    await screen.findByText(/your address is recorded/i);
    expect(field).toHaveValue("");
  });

  it("shows the server's reason when it refuses", async () => {
    const user = userEvent.setup();
    mockFetch({
      ok: false,
      status: 429,
      json: () => ({ ok: false, issues: ["Please wait a moment."] }),
    });
    render(<WaitlistForm />);

    await user.type(
      screen.getByLabelText("Your email address"),
      "parent@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please wait a moment.",
    );
  });

  it("falls back to its own wording when the server says nothing useful", async () => {
    const user = userEvent.setup();
    mockFetch({
      ok: false,
      status: 500,
      json: () => {
        throw new Error("not json");
      },
    });
    render(<WaitlistForm />);

    await user.type(
      screen.getByLabelText("Your email address"),
      "parent@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /something went wrong at our end/i,
    );
  });

  it("recovers from a network failure with a message worth acting on", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline"))),
    );
    render(<WaitlistForm />);

    await user.type(
      screen.getByLabelText("Your email address"),
      "parent@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not reach the server/i,
    );
  });

  it("stores nothing in the browser", async () => {
    const user = userEvent.setup();
    ok();
    render(<WaitlistForm />);

    await user.type(
      screen.getByLabelText("Your email address"),
      "parent@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));
    await screen.findByText(/your address is recorded/i);

    expect(window.localStorage.length).toBe(0);
  });
});
