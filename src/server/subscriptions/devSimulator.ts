import type {
  StripeEvent,
  StripeSubscription,
} from "@/features/subscriptions/events";
import type { PriceMap } from "@/features/subscriptions/plans";

/**
 * The development-mode subscription simulator.
 *
 * When billing is unconfigured in local development there is no Stripe to send
 * webhooks, so this synthesises the very same Stripe-shaped events the real
 * endpoint would receive and hands them to the same `applyStripeEvent`
 * dispatcher. That means the offline "test mode" exercises the real state
 * machine, not a parallel fake — the subscription states and entitlement a
 * developer sees locally are produced by the code that runs in production.
 *
 * It is reachable only from `/api/billing/dev-activate`, which is itself gated to
 * local development with billing off. Nothing here runs in a deployed app.
 */

export type DevScenario =
  "start-monthly" | "start-annual" | "past-due" | "cancel";

const DEV_SCENARIOS: readonly DevScenario[] = [
  "start-monthly",
  "start-annual",
  "past-due",
  "cancel",
];

export function isDevScenario(value: unknown): value is DevScenario {
  return (
    typeof value === "string" &&
    (DEV_SCENARIOS as readonly string[]).includes(value)
  );
}

/**
 * Sentinel Stripe Price IDs used only by the simulator, so a simulated
 * subscription resolves to a real plan through the ordinary `planForPriceId`
 * path. Passed to `applyStripeEvent` in place of the (empty) live price map.
 */
const DEV_MONTHLY_PRICE = "price_dev_monthly";
const DEV_ANNUAL_PRICE = "price_dev_annual";

export const DEV_PRICE_MAP: PriceMap = {
  monthly: DEV_MONTHLY_PRICE,
  annual: DEV_ANNUAL_PRICE,
};

const DAY_SECONDS = 60 * 60 * 24;

function subscription(
  familyId: string,
  fields: Pick<StripeSubscription, "status" | "cancel_at_period_end"> & {
    priceId: string;
    periodEndInDays: number;
  },
): StripeSubscription {
  return {
    id: `sub_dev_${familyId}`,
    status: fields.status,
    cancel_at_period_end: fields.cancel_at_period_end,
    current_period_end:
      Math.floor(Date.now() / 1000) + fields.periodEndInDays * DAY_SECONDS,
    customer: `cus_dev_${familyId}`,
    items: { data: [{ price: { id: fields.priceId } }] },
    metadata: { family_id: familyId },
  };
}

/** Builds a unique, self-resolving event for a simulated scenario. */
export function simulateEvent(
  familyId: string,
  scenario: DevScenario,
): StripeEvent {
  const id = `evt_dev_${crypto.randomUUID()}`;

  switch (scenario) {
    case "start-monthly":
      return {
        id,
        type: "customer.subscription.updated",
        data: {
          object: subscription(familyId, {
            status: "active",
            cancel_at_period_end: false,
            priceId: DEV_MONTHLY_PRICE,
            periodEndInDays: 30,
          }),
        },
      };
    case "start-annual":
      return {
        id,
        type: "customer.subscription.updated",
        data: {
          object: subscription(familyId, {
            status: "active",
            cancel_at_period_end: false,
            priceId: DEV_ANNUAL_PRICE,
            periodEndInDays: 365,
          }),
        },
      };
    case "past-due":
      return {
        id,
        type: "customer.subscription.updated",
        data: {
          object: subscription(familyId, {
            status: "past_due",
            cancel_at_period_end: false,
            priceId: DEV_MONTHLY_PRICE,
            periodEndInDays: 30,
          }),
        },
      };
    case "cancel":
      return {
        id,
        type: "customer.subscription.deleted",
        data: {
          object: subscription(familyId, {
            status: "canceled",
            cancel_at_period_end: false,
            priceId: DEV_MONTHLY_PRICE,
            periodEndInDays: 0,
          }),
        },
      };
  }
}
