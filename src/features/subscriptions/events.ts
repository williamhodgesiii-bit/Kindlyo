/**
 * The slice of Stripe's webhook payloads we actually read.
 *
 * Deliberately minimal: only the fields the subscription state machine needs,
 * typed narrowly so the dispatcher (`src/server/subscriptions/webhook.ts`) never
 * reaches blindly into an `any`. The full payloads are much larger; everything
 * not modelled here is ignored on purpose.
 *
 * The `family_id` we set on the Checkout Session and on the subscription's
 * metadata is what ties a Stripe object back to a Little Learner's Club family
 * without ever
 * trusting the browser — the webhook is signature-verified, and the family is
 * resolved from Stripe's own copy of the id (or, failing that, from the stored
 * customer mapping).
 */

export type StripeEvent = {
  id: string;
  type: string;
  data: { object: unknown };
};

export type StripeSubscription = {
  id: string;
  status: string;
  cancel_at_period_end: boolean;
  current_period_end: number | null;
  customer: string;
  items: { data: Array<{ price: { id: string } }> };
  metadata?: { family_id?: string } | null;
};

export type StripeCheckoutSession = {
  id: string;
  client_reference_id: string | null;
  customer: string | null;
  subscription: string | null;
  metadata?: { family_id?: string } | null;
};

export type StripeInvoice = {
  id: string;
  customer: string | null;
  subscription: string | null;
};

/** ISO string for a Stripe unix-seconds timestamp, or null. */
export function isoFromUnixSeconds(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds)) return null;
  return new Date(seconds * 1000).toISOString();
}

/** The Stripe Price ID on a subscription's first line item, when present. */
export function priceIdOf(subscription: StripeSubscription): string | null {
  return subscription.items.data[0]?.price.id ?? null;
}

/** The Little Learner's Club family id carried on a subscription's metadata. */
export function familyIdOf(object: {
  metadata?: { family_id?: string } | null;
}): string | null {
  const value = object.metadata?.family_id;
  return typeof value === "string" && value !== "" ? value : null;
}
