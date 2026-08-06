/**
 * The subscription domain types.
 *
 * One family, one subscription (docs/PRODUCT_BRIEF.md). Everything here is the
 * app's own vocabulary, deliberately narrower than Stripe's: the mapping from
 * Stripe's many statuses onto this small closed set lives in `subscription.ts`,
 * so the rest of the app never branches on a raw provider string.
 */

/**
 * A family's access status, in the app's own terms.
 *
 * - `free` — no paid membership. The default, and where a family lands after a
 *   membership ends. Free introductory lessons are still available.
 * - `trialing` — inside a free trial of the paid membership; full access.
 * - `active` — a paid membership in good standing; full access.
 * - `past_due` — a payment failed and Stripe is retrying. Access is retained
 *   during this grace window (see `hasPaidAccess`) so a lapsed card never locks
 *   a child out mid-lesson; the parent is asked to update their card.
 * - `canceled` — the membership has ended (period elapsed, or dunning
 *   exhausted). Back to free access.
 */
export type SubscriptionStatus =
  "free" | "trialing" | "active" | "past_due" | "canceled";

/** The two billing cadences on offer. One subscription, billed either way. */
export type SubscriptionPlan = "monthly" | "annual";

/**
 * The full server-side subscription record for a family.
 *
 * Holds the Stripe identifiers, which never leave the server — the browser
 * receives the narrower `BillingState` below. Persisted by the
 * `SubscriptionStore` (see `src/server/subscriptions`).
 */
export type Subscription = {
  status: SubscriptionStatus;
  plan: SubscriptionPlan | null;
  /** ISO timestamp the current paid period runs to, when known. */
  currentPeriodEnd: string | null;
  /** True once the parent has asked to end the membership at period end. */
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

/**
 * What the browser is told about a family's subscription.
 *
 * A projection of `Subscription` with the Stripe identifiers removed: the
 * client never needs them, and entitlement is always re-derived on the server
 * (`docs/BILLING.md`: never trust subscription state from the browser). This is
 * a read-only view — nothing the client sends can change a status.
 */
export type BillingState = {
  status: SubscriptionStatus;
  plan: SubscriptionPlan | null;
  hasPaidAccess: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
};
