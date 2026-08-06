import type { SubscriptionPlan } from "./types";

/**
 * The plan catalogue.
 *
 * Two cadences of the one family membership. Deliberately carries no price:
 * pricing is not set (see `src/app/(marketing)/pricing/page.tsx`), and the real
 * amount a parent pays is the Stripe Price shown at checkout, never a number
 * hard-coded here that could drift out of date. What each plan maps to is a
 * Stripe Price ID, supplied per environment (see `config.ts`).
 */

export type PlanInterval = "month" | "year";

export type PlanDefinition = {
  plan: SubscriptionPlan;
  name: string;
  interval: PlanInterval;
  blurb: string;
};

export const PLAN_DEFINITIONS: readonly PlanDefinition[] = [
  {
    plan: "monthly",
    name: "Monthly",
    interval: "month",
    blurb: "The whole household, billed each month. Cancel any time.",
  },
  {
    plan: "annual",
    name: "Annual",
    interval: "year",
    blurb: "The whole household, billed once a year for a little less.",
  },
];

/** The Stripe Price ID for each plan, or null when that plan is unconfigured. */
export type PriceMap = Record<SubscriptionPlan, string | null>;

/** The Stripe Price ID to check out with, or null when the plan is unconfigured. */
export function priceIdForPlan(
  plan: SubscriptionPlan,
  prices: PriceMap,
): string | null {
  return prices[plan];
}

/** Which plan a Stripe Price belongs to, or null when it is not one of ours. */
export function planForPriceId(
  priceId: string,
  prices: PriceMap,
): SubscriptionPlan | null {
  if (prices.monthly !== null && priceId === prices.monthly) return "monthly";
  if (prices.annual !== null && priceId === prices.annual) return "annual";
  return null;
}

/** Narrows an arbitrary string to a known plan. */
export function isSubscriptionPlan(value: unknown): value is SubscriptionPlan {
  return value === "monthly" || value === "annual";
}
