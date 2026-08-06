import { describe, expect, it } from "vitest";
import {
  isSubscriptionPlan,
  planForPriceId,
  PLAN_DEFINITIONS,
  priceIdForPlan,
  type PriceMap,
} from "./plans";

const prices: PriceMap = { monthly: "price_m", annual: "price_a" };

describe("plan catalogue", () => {
  it("offers exactly the monthly and annual cadences", () => {
    expect(PLAN_DEFINITIONS.map((plan) => plan.plan)).toEqual([
      "monthly",
      "annual",
    ]);
  });

  it("quotes no price of its own — the amount is the Stripe Price at checkout", () => {
    for (const plan of PLAN_DEFINITIONS) {
      expect(plan).not.toHaveProperty("price");
      expect(JSON.stringify(plan)).not.toMatch(/[£$€]/);
    }
  });
});

describe("priceIdForPlan", () => {
  it("resolves each plan to its configured Stripe Price", () => {
    expect(priceIdForPlan("monthly", prices)).toBe("price_m");
    expect(priceIdForPlan("annual", prices)).toBe("price_a");
  });

  it("returns null for an unconfigured plan", () => {
    expect(
      priceIdForPlan("monthly", { monthly: null, annual: null }),
    ).toBeNull();
  });
});

describe("planForPriceId", () => {
  it("maps a known Stripe Price back to its plan", () => {
    expect(planForPriceId("price_m", prices)).toBe("monthly");
    expect(planForPriceId("price_a", prices)).toBe("annual");
  });

  it("returns null for an unknown price", () => {
    expect(planForPriceId("price_other", prices)).toBeNull();
  });

  it("never matches an unconfigured (null) price against undefined input", () => {
    expect(
      planForPriceId("price_m", { monthly: null, annual: null }),
    ).toBeNull();
  });
});

describe("isSubscriptionPlan", () => {
  it("accepts the two known plans and rejects everything else", () => {
    expect(isSubscriptionPlan("monthly")).toBe(true);
    expect(isSubscriptionPlan("annual")).toBe(true);
    expect(isSubscriptionPlan("weekly")).toBe(false);
    expect(isSubscriptionPlan(undefined)).toBe(false);
    expect(isSubscriptionPlan(2)).toBe(false);
  });
});
