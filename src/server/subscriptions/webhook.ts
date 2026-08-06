import {
  familyIdOf,
  isoFromUnixSeconds,
  priceIdOf,
  type StripeCheckoutSession,
  type StripeEvent,
  type StripeInvoice,
  type StripeSubscription,
} from "@/features/subscriptions/events";
import { planForPriceId, type PriceMap } from "@/features/subscriptions/plans";
import { mapStripeStatus } from "@/features/subscriptions/subscription";
import type { SubscriptionRecord, SubscriptionStore } from "./store";

/**
 * Applying a verified Stripe event to the subscription store.
 *
 * This is the subscription state machine's inbound half: given a Stripe webhook
 * that has already passed signature verification (in the route), move the
 * family's stored subscription to its new state. It is deliberately store-driven
 * and free of network or Stripe SDK calls, so every transition in
 * docs/BILLING.md is unit-tested against the in-memory store.
 *
 * Idempotency lives here, not in the route: the event id is recorded before any
 * change, so a Stripe redelivery is a no-op. If application throws, the record
 * is removed so the delivery is retryable rather than wrongly remembered as
 * done.
 */

export type WebhookResult =
  | { status: "applied"; type: string }
  | { status: "duplicate"; type: string }
  | { status: "ignored"; type: string }
  /** Signature was valid but the event could not be tied to a family. */
  | { status: "unresolved"; type: string };

const now = (): string => new Date().toISOString();

async function resolveFamilyId(
  store: SubscriptionStore,
  subscription: StripeSubscription,
): Promise<string | null> {
  const fromMetadata = familyIdOf(subscription);
  if (fromMetadata !== null) return fromMetadata;
  const linked = await store.getByCustomerId(subscription.customer);
  return linked?.familyId ?? null;
}

function recordFromSubscription(
  familyId: string,
  subscription: StripeSubscription,
  prices: PriceMap,
  canceled: boolean,
): SubscriptionRecord {
  const priceId = priceIdOf(subscription);
  return {
    familyId,
    status: canceled ? "canceled" : mapStripeStatus(subscription.status),
    plan: priceId === null ? null : planForPriceId(priceId, prices),
    currentPeriodEnd: isoFromUnixSeconds(subscription.current_period_end),
    // A deleted subscription is over; there is nothing left to cancel at period end.
    cancelAtPeriodEnd: canceled ? false : subscription.cancel_at_period_end,
    stripeCustomerId: subscription.customer,
    stripeSubscriptionId: subscription.id,
    updatedAt: now(),
  };
}

async function apply(
  store: SubscriptionStore,
  event: StripeEvent,
  prices: PriceMap,
): Promise<WebhookResult> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as StripeCheckoutSession;
      const familyId = session.client_reference_id ?? familyIdOf(session);
      if (familyId === null || session.customer === null) {
        return { status: "unresolved", type: event.type };
      }
      // Link the customer now; the subscription's status arrives via the
      // customer.subscription.* events around the same time.
      await store.linkCustomer(familyId, session.customer);
      return { status: "applied", type: event.type };
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as StripeSubscription;
      const familyId = await resolveFamilyId(store, subscription);
      if (familyId === null) return { status: "unresolved", type: event.type };
      const canceled = event.type === "customer.subscription.deleted";
      await store.upsert(
        recordFromSubscription(familyId, subscription, prices, canceled),
      );
      return { status: "applied", type: event.type };
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as StripeInvoice;
      if (invoice.customer === null) {
        return { status: "unresolved", type: event.type };
      }
      const record = await store.getByCustomerId(invoice.customer);
      if (record === null) return { status: "unresolved", type: event.type };
      // Only a membership in good standing slips into past_due; a failed invoice
      // never resurrects a canceled family.
      if (record.status === "active" || record.status === "trialing") {
        await store.upsert({ ...record, status: "past_due", updatedAt: now() });
      }
      return { status: "applied", type: event.type };
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as StripeInvoice;
      if (invoice.customer === null) {
        return { status: "unresolved", type: event.type };
      }
      const record = await store.getByCustomerId(invoice.customer);
      if (record === null) return { status: "unresolved", type: event.type };
      // A recovered payment lifts a past-due membership back to active.
      if (record.status === "past_due") {
        await store.upsert({ ...record, status: "active", updatedAt: now() });
      }
      return { status: "applied", type: event.type };
    }

    default:
      return { status: "ignored", type: event.type };
  }
}

export async function applyStripeEvent(
  store: SubscriptionStore,
  event: StripeEvent,
  prices: PriceMap,
): Promise<WebhookResult> {
  const firstTime = await store.markEventProcessed(event.id, event.type);
  if (!firstTime) return { status: "duplicate", type: event.type };

  try {
    return await apply(store, event, prices);
  } catch (error) {
    // Let the delivery be retried instead of being remembered as processed.
    await store.unmarkEventProcessed(event.id);
    throw error;
  }
}
