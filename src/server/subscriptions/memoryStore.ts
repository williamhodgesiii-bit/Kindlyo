import { freeSubscription } from "@/features/subscriptions/subscription";
import type { SubscriptionRecord, SubscriptionStore } from "./store";

/**
 * The in-memory subscription store: the offline stand-in for PostgreSQL.
 *
 * Selected only when the database is not configured — local development, CI, and
 * the e2e suite — and barred from deployed environments by
 * `assertLocalPersistenceAllowed`, exactly like the in-memory family store
 * (decision 034). It is also what the subscription unit tests run against, so
 * the state-machine transitions and idempotency are proven with no Stripe and no
 * database. Everything is lost on restart, which is right for a stand-in.
 */
export function createMemorySubscriptionStore(): SubscriptionStore {
  const byFamily = new Map<string, SubscriptionRecord>();
  const familyByCustomer = new Map<string, string>();
  const processedEvents = new Set<string>();

  function index(record: SubscriptionRecord): void {
    byFamily.set(record.familyId, record);
    if (record.stripeCustomerId !== null) {
      familyByCustomer.set(record.stripeCustomerId, record.familyId);
    }
  }

  return {
    getByFamilyId(familyId) {
      return Promise.resolve(byFamily.get(familyId) ?? null);
    },

    getByCustomerId(customerId) {
      const familyId = familyByCustomer.get(customerId);
      if (familyId === undefined) return Promise.resolve(null);
      return Promise.resolve(byFamily.get(familyId) ?? null);
    },

    upsert(record) {
      index({ ...record });
      return Promise.resolve();
    },

    linkCustomer(familyId, customerId) {
      const existing = byFamily.get(familyId);
      const next: SubscriptionRecord = existing
        ? { ...existing, stripeCustomerId: customerId }
        : {
            ...freeSubscription,
            familyId,
            stripeCustomerId: customerId,
            updatedAt: null,
          };
      index(next);
      return Promise.resolve();
    },

    markEventProcessed(eventId) {
      if (processedEvents.has(eventId)) return Promise.resolve(false);
      processedEvents.add(eventId);
      return Promise.resolve(true);
    },

    unmarkEventProcessed(eventId) {
      processedEvents.delete(eventId);
      return Promise.resolve();
    },
  };
}
