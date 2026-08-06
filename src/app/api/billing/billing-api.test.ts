import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthUser } from "@/features/auth/types";

/**
 * The billing routes at the HTTP boundary.
 *
 * Auth is mocked; the stores underneath are the real in-memory ones the routes
 * select offline (billing unconfigured, so the mode is `dev` and there is no
 * Stripe gateway). These prove the guard rails: a session is required, input is
 * validated, and the environment's "billing off" states surface as clear status
 * codes rather than errors.
 */

let signedInUser: AuthUser | null = null;

vi.mock("@/features/auth/session", () => ({
  getSessionUser: () => Promise.resolve(signedInUser),
}));

const { GET: getBilling } = await import("./route");
const { POST: startCheckout } = await import("./checkout/route");
const { POST: startPortal } = await import("./portal/route");
const { POST: webhook } = await import("./webhook/route");
const { POST: devActivate } = await import("./dev-activate/route");

function jsonRequest(url: string, body: unknown): Request {
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  signedInUser = null;
});

describe("the billing routes require a session", () => {
  it("answers 401 for the state read when nobody is signed in", async () => {
    expect((await getBilling()).status).toBe(401);
  });

  it("answers 401 for checkout when nobody is signed in", async () => {
    const response = await startCheckout(
      jsonRequest("http://localhost/api/billing/checkout", { plan: "monthly" }),
    );
    expect(response.status).toBe(401);
  });

  it("answers 401 for the portal when nobody is signed in", async () => {
    expect((await startPortal()).status).toBe(401);
  });
});

describe("the billing state read", () => {
  it("returns the free plan for a signed-in parent with no subscription", async () => {
    signedInUser = { id: "bill-read", email: "read@example.com" };
    const response = await getBilling();
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      status: string;
      hasPaidAccess: boolean;
    };
    expect(body.status).toBe("free");
    expect(body.hasPaidAccess).toBe(false);
  });
});

describe("checkout input and availability", () => {
  it("rejects a body with no valid plan", async () => {
    signedInUser = { id: "bill-plan", email: "plan@example.com" };
    const response = await startCheckout(
      jsonRequest("http://localhost/api/billing/checkout", { plan: "weekly" }),
    );
    expect(response.status).toBe(400);
  });

  it("reports 503 when billing is not available in this environment", async () => {
    signedInUser = { id: "bill-503", email: "unavailable@example.com" };
    const response = await startCheckout(
      jsonRequest("http://localhost/api/billing/checkout", { plan: "monthly" }),
    );
    expect(response.status).toBe(503);
  });
});

describe("the portal", () => {
  it("reports 409 when there is no subscription to manage", async () => {
    signedInUser = { id: "bill-portal", email: "portal@example.com" };
    expect((await startPortal()).status).toBe(409);
  });
});

describe("the webhook endpoint", () => {
  it("is off (503) when billing is not configured", async () => {
    const response = await webhook(
      new Request("http://localhost/api/billing/webhook", {
        method: "POST",
        body: "{}",
      }),
    );
    expect(response.status).toBe(503);
  });
});

describe("the dev-activate route", () => {
  it("is not exposed outside the dev server", async () => {
    // NODE_ENV is "test" here, so the dev-only guard returns 404.
    signedInUser = { id: "bill-dev", email: "dev@example.com" };
    const response = await devActivate(
      jsonRequest("http://localhost/api/billing/dev-activate", {
        scenario: "start-monthly",
      }),
    );
    expect(response.status).toBe(404);
  });
});
