import type { BillingState, Subscription, SubscriptionStatus } from "./types";

/**
 * The subscription state machine, as pure functions.
 *
 * This is the single place Stripe's vocabulary becomes the app's, and the
 * single place "does this family have paid access?" is answered. Keeping it pure
 * is what lets `docs/BILLING.md`'s state transitions be tested exhaustively
 * offline, with no Stripe and no database — the security requirement to test
 * subscription-state transitions lands here.
 */

/** A family with no record at all is on the free plan. */
export const freeSubscription: Subscription = {
  status: "free",
  plan: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  stripeCustomerId: null,
  stripeSubscriptionId: null,
};

/**
 * Maps a raw Stripe subscription status onto the app's closed set.
 *
 * Stripe carries more states than the product needs, so several collapse:
 * `unpaid` (dunning exhausted) and `paused` are treated as `canceled` — access
 * ends; `incomplete`/`incomplete_expired` (a checkout that never completed its
 * first payment) fall back to `free`, because nothing was ever granted. Anything
 * unrecognised is `free`, the safe default that grants no paid access.
 *
 * `cancel_at_period_end` deliberately does NOT change the status: Stripe keeps a
 * subscription `active` until the period actually elapses, and so do we. The
 * flag is carried separately so the UI can say "your membership is ending"
 * without pretending it has already ended.
 */
export function mapStripeStatus(stripeStatus: string): SubscriptionStatus {
  switch (stripeStatus) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
    case "paused":
      return "canceled";
    case "incomplete":
    case "incomplete_expired":
      return "free";
    default:
      return "free";
  }
}

/** The statuses that grant access to paid content. */
const ACCESS_STATUSES: ReadonlySet<SubscriptionStatus> = new Set([
  "trialing",
  "active",
  // Grace: access is kept while Stripe retries a failed payment, so a lapsed
  // card is never a locked-out child. Stripe's dunning eventually moves the
  // subscription to canceled/unpaid, at which point access ends.
  "past_due",
]);

/** Whether a family currently has paid access. The one entitlement rule. */
export function hasPaidAccess(
  subscription: Pick<Subscription, "status">,
): boolean {
  return ACCESS_STATUSES.has(subscription.status);
}

/** The browser-facing projection: Stripe identifiers dropped, access derived. */
export function toBillingState(subscription: Subscription): BillingState {
  return {
    status: subscription.status,
    plan: subscription.plan,
    hasPaidAccess: hasPaidAccess(subscription),
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    currentPeriodEnd: subscription.currentPeriodEnd,
  };
}

export type BillingTone = "positive" | "neutral" | "attention";

export type BillingDescription = {
  tone: BillingTone;
  title: string;
  body: string;
};

const defaultFormatDate = (iso: string): string =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(iso));

/**
 * The customer-facing description of a subscription state.
 *
 * Copy lives here, beside the state machine, so "clear customer-facing states"
 * is a tested property rather than something scattered through JSX. The tone is
 * warm and never punitive (docs/CURRICULUM_PRINCIPLES.md: no shame): a past-due
 * card is "needs attention", not a failure, and access is not yet withdrawn.
 *
 * The date formatter is injected so the pure function stays deterministic in
 * tests; the default renders a long British date to match the rest of the site.
 */
export function describeBilling(
  state: Pick<
    BillingState,
    "status" | "cancelAtPeriodEnd" | "currentPeriodEnd"
  >,
  formatDate: (iso: string) => string = defaultFormatDate,
): BillingDescription {
  const on = state.currentPeriodEnd ? formatDate(state.currentPeriodEnd) : null;

  switch (state.status) {
    case "trialing":
      return {
        tone: "positive",
        title: "Your free trial is active",
        body: on
          ? `You have full access until ${on}. There is nothing to pay yet.`
          : "You have full access while your trial runs.",
      };
    case "active":
      if (state.cancelAtPeriodEnd) {
        return {
          tone: "attention",
          title: "Your membership is ending",
          body: on
            ? `You will keep full access until ${on}, then move to the free plan.`
            : "You will keep full access until the end of the current period.",
        };
      }
      return {
        tone: "positive",
        title: "Your family membership is active",
        body: on
          ? `It renews on ${on}. Thank you for supporting Little Learner's Club.`
          : "Thank you for supporting Little Learner's Club.",
      };
    case "past_due":
      return {
        tone: "attention",
        title: "Your payment needs attention",
        body: "We could not take the last payment. Update your card to keep your family membership — nothing is locked yet.",
      };
    case "canceled":
      return {
        tone: "neutral",
        title: "Your membership has ended",
        body: "You are back on the free plan. You can start a membership again whenever you like.",
      };
    case "free":
    default:
      return {
        tone: "neutral",
        title: "You are on the free plan",
        body: "The free introductory lessons are open to you. A family membership unlocks everything, for the whole household.",
      };
  }
}
