import type { Subscription } from "@/features/subscriptions/types";

/**
 * The persistence port for a family's subscription.
 *
 * The same seam as `FamilyStore` (decision 034): one interface, a real
 * PostgreSQL adapter (`postgresStore`) and an in-memory stand-in (`memoryStore`),
 * chosen by configuration. It is scoped to a `familyId` the caller has already
 * resolved from the authenticated parent — except the webhook path, which has no
 * user and instead resolves a family from Stripe's own identifiers
 * (`getByCustomerId`), having first verified the delivery's signature.
 *
 * `markEventProcessed` / `unmarkEventProcessed` are the idempotency primitive:
 * every Stripe event is recorded by id before it is applied, so a redelivery is
 * a no-op (docs/BILLING.md). The unmark compensates when application fails, so a
 * genuine Stripe retry is not mistaken for a duplicate.
 */

export type SubscriptionRecord = Subscription & {
  familyId: string;
  updatedAt: string | null;
};

export interface SubscriptionStore {
  getByFamilyId(familyId: string): Promise<SubscriptionRecord | null>;
  getByCustomerId(customerId: string): Promise<SubscriptionRecord | null>;

  /** Writes the whole record for a family (one subscription per family). */
  upsert(record: SubscriptionRecord): Promise<void>;

  /**
   * Attaches a Stripe customer to a family without disturbing its status,
   * creating a free-plan row if none exists yet. Used at checkout completion,
   * when the customer is known before the subscription's state is.
   */
  linkCustomer(familyId: string, customerId: string): Promise<void>;

  /** Records an event id; returns true only the first time (else it is a duplicate). */
  markEventProcessed(eventId: string, type: string): Promise<boolean>;
  /** Removes an event-id record so a failed application can be retried. */
  unmarkEventProcessed(eventId: string): Promise<void>;
}
