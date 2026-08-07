import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AccountPanel } from "./AccountPanel";

let fetchMock: ReturnType<typeof vi.fn>;
let submitSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue({ ok: true });
  vi.stubGlobal("fetch", fetchMock);
  // Deletion ends the session by submitting a form; jsdom cannot navigate, so
  // stub the submit and assert it was (or was not) reached.
  submitSpy = vi
    .spyOn(HTMLFormElement.prototype, "submit")
    .mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("AccountPanel", () => {
  it("offers a data download from the export endpoint", () => {
    render(<AccountPanel />);
    expect(
      screen.getByRole("link", { name: "Download my data" }),
    ).toHaveAttribute("href", "/api/family/export");
  });

  it("offers signing out as the gentler alternative", () => {
    render(<AccountPanel />);
    expect(
      screen.getByRole("button", { name: "Sign out instead" }),
    ).toBeInTheDocument();
  });

  it("asks for confirmation before deleting anything", async () => {
    const user = userEvent.setup();
    render(<AccountPanel />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    expect(
      screen.getByRole("heading", { name: "Delete your account?" }),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("deletes the account and then ends the session on confirm", async () => {
    const user = userEvent.setup();
    render(<AccountPanel />);

    await user.click(screen.getByRole("button", { name: "Delete account" }));
    const dialog = screen.getByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: "Delete account" }),
    );

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith("/api/family", {
        method: "DELETE",
      }),
    );
    expect(submitSpy).toHaveBeenCalled();
  });

  it("keeps the account and explains when deletion fails", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false });
    const user = userEvent.setup();
    render(<AccountPanel />);

    await user.click(screen.getByRole("button", { name: "Delete account" }));
    const dialog = screen.getByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: "Delete account" }),
    );

    expect(
      await screen.findByText(/your account was not changed/i),
    ).toBeInTheDocument();
    expect(submitSpy).not.toHaveBeenCalled();
  });
});
