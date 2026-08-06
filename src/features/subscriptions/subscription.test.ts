import { describe, expect, it } from "vitest";
import {
  describeBilling,
  freeSubscription,
  hasPaidAccess,
  mapStripeStatus,
  toBillingState,
} from "./subscription";
import type { Subscription, SubscriptionStatus } from "./types";

const fixedDate = () => "1 January 2026";

function sub(overrides: Partial<Subscription> = {}): Subscription {
  return { ...freeSubscription, ...overrides };
}

describe("mapStripeStatus", () => {
  it("passes through the statuses the app models directly", () => {
    expect(mapStripeStatus("trialing")).toBe("trialing");
    expect(mapStripeStatus("active")).toBe("active");
    expect(mapStripeStatus("past_due")).toBe("past_due");
    expect(mapStripeStatus("canceled")).toBe("canceled");
  });

  it("collapses exhausted and paused states to canceled", () => {
    expect(mapStripeStatus("unpaid")).toBe("canceled");
    expect(mapStripeStatus("paused")).toBe("canceled");
  });

  it("treats a never-activated checkout as free", () => {
    expect(mapStripeStatus("incomplete")).toBe("free");
    expect(mapStripeStatus("incomplete_expired")).toBe("free");
  });

  it("falls back to free for anything unrecognised", () => {
    expect(mapStripeStatus("something_new")).toBe("free");
  });
});

describe("hasPaidAccess", () => {
  const granted: SubscriptionStatus[] = ["trialing", "active", "past_due"];
  const denied: SubscriptionStatus[] = ["free", "canceled"];

  it.each(granted)("grants access while %s", (status) => {
    expect(hasPaidAccess({ status })).toBe(true);
  });

  it.each(denied)("denies access while %s", (status) => {
    expect(hasPaidAccess({ status })).toBe(false);
  });

  it("keeps access during the past-due grace window", () => {
    // A failed card must not lock a child out mid-lesson; Stripe's dunning
    // eventually moves this to canceled, at which point access ends.
    expect(hasPaidAccess({ status: "past_due" })).toBe(true);
  });
});

describe("toBillingState", () => {
  it("drops the Stripe identifiers and derives access", () => {
    const state = toBillingState(
      sub({
        status: "active",
        plan: "annual",
        currentPeriodEnd: "2026-01-01T00:00:00.000Z",
        stripeCustomerId: "cus_secret",
        stripeSubscriptionId: "sub_secret",
      }),
    );

    expect(state).toEqual({
      status: "active",
      plan: "annual",
      hasPaidAccess: true,
      cancelAtPeriodEnd: false,
      currentPeriodEnd: "2026-01-01T00:00:00.000Z",
    });
    expect(state).not.toHaveProperty("stripeCustomerId");
  });
});

describe("describeBilling", () => {
  it("welcomes a free family without pressure", () => {
    const description = describeBilling(freeSubscription, fixedDate);
    expect(description.tone).toBe("neutral");
    expect(description.title).toMatch(/free plan/i);
  });

  it("celebrates an active membership and names the renewal date", () => {
    const description = describeBilling(
      { status: "active", cancelAtPeriodEnd: false, currentPeriodEnd: "x" },
      fixedDate,
    );
    expect(description.tone).toBe("positive");
    expect(description.body).toContain("1 January 2026");
  });

  it("flags a membership set to end, without pretending it already has", () => {
    const description = describeBilling(
      { status: "active", cancelAtPeriodEnd: true, currentPeriodEnd: "x" },
      fixedDate,
    );
    expect(description.tone).toBe("attention");
    expect(description.title).toMatch(/ending/i);
    expect(description.body).toContain("1 January 2026");
  });

  it("frames a past-due card as attention, not failure, and never locks", () => {
    const description = describeBilling(
      { status: "past_due", cancelAtPeriodEnd: false, currentPeriodEnd: null },
      fixedDate,
    );
    expect(description.tone).toBe("attention");
    expect(description.body).toMatch(/nothing is locked/i);
  });

  it("describes a cancelled membership as a return to free", () => {
    const description = describeBilling(
      { status: "canceled", cancelAtPeriodEnd: false, currentPeriodEnd: null },
      fixedDate,
    );
    expect(description.tone).toBe("neutral");
    expect(description.title).toMatch(/ended/i);
  });
});
