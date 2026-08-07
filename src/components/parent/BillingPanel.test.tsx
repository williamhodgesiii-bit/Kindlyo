import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PLAN_DEFINITIONS } from "@/features/subscriptions/plans";
import type { BillingState } from "@/features/subscriptions/types";
import { BillingPanel } from "./BillingPanel";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

// A fixed sum so the test knows the answer; isAnswerCorrect stays real.
vi.mock("@/features/parental-gate/puzzle", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/parental-gate/puzzle")>();
  return {
    ...actual,
    createGatePuzzle: () => ({
      a: 7,
      b: 5,
      answer: 12,
      question: "What is seven plus five?",
    }),
  };
});

const FREE_STATE: BillingState = {
  status: "free",
  plan: null,
  hasPaidAccess: false,
  cancelAtPeriodEnd: false,
  currentPeriodEnd: null,
};

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  // On success redirectVia calls window.location.assign(url); a hash URL keeps
  // jsdom quiet (it handles hash changes), and these tests only assert that the
  // checkout request was — or was not — made.
  fetchMock = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ url: "#checkout" }) });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("BillingPanel checkout gate", () => {
  it("opens the parental gate before starting a live checkout", async () => {
    const user = userEvent.setup();
    render(
      <BillingPanel state={FREE_STATE} mode="live" plans={PLAN_DEFINITIONS} />,
    );

    await user.click(screen.getByRole("button", { name: /Choose monthly/i }));

    // The gate stands in front of payment: no network call has happened yet.
    expect(
      screen.getByRole("heading", { name: "Ask a grown-up" }),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("starts checkout only once the gate is solved", async () => {
    const user = userEvent.setup();
    render(
      <BillingPanel state={FREE_STATE} mode="live" plans={PLAN_DEFINITIONS} />,
    );

    await user.click(screen.getByRole("button", { name: /Choose monthly/i }));
    await user.type(screen.getByRole("textbox"), "12");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/billing/checkout",
        expect.objectContaining({ method: "POST" }),
      ),
    );
  });

  it("does not start checkout if the gate is cancelled", async () => {
    const user = userEvent.setup();
    render(
      <BillingPanel state={FREE_STATE} mode="live" plans={PLAN_DEFINITIONS} />,
    );

    await user.click(screen.getByRole("button", { name: /Choose monthly/i }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
