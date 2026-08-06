import { beforeEach, describe, expect, it } from "vitest";
import type {
  StripeCheckoutSession,
  StripeEvent,
  StripeInvoice,
  StripeSubscription,
} from "@/features/subscriptions/events";
import type { PriceMap } from "@/features/subscriptions/plans";
import { hasPaidAccess } from "@/features/subscriptions/subscription";
import { createMemorySubscriptionStore } from "./memoryStore";
import type { SubscriptionStore } from "./store";
import { applyStripeEvent } from "./webhook";

/**
 * The subscription state machine's inbound half, exercised end to end over the
 * in-memory store. Every transition in docs/BILLING.md is here, plus the two
 * security-relevant properties: idempotency (a redelivery is a no-op) and family
 * resolution that never trusts the browser.
 */

const prices: PriceMap = { monthly: "price_m", annual: "price_a" };
const FAMILY = "fam_1";
const CUSTOMER = "cus_1";

/** Asserts a value is present and returns it non-null, avoiding `!` in tests. */
function present<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) {
    throw new Error("expected a subscription record");
  }
  return value;
}

let store: SubscriptionStore;
let counter = 0;

function eventId(): string {
  counter += 1;
  return `evt_${counter}`;
}

function subscriptionObject(
  overrides: Partial<StripeSubscription> = {},
): StripeSubscription {
  return {
    id: "sub_1",
    status: "active",
    cancel_at_period_end: false,
    current_period_end: 1_800_000_000,
    customer: CUSTOMER,
    items: { data: [{ price: { id: "price_m" } }] },
    metadata: { family_id: FAMILY },
    ...overrides,
  };
}

function subscriptionEvent(
  type: string,
  overrides: Partial<StripeSubscription> = {},
  id: string = eventId(),
): StripeEvent {
  return { id, type, data: { object: subscriptionObject(overrides) } };
}

function checkoutEvent(
  overrides: Partial<StripeCheckoutSession> = {},
): StripeEvent {
  const session: StripeCheckoutSession = {
    id: "cs_1",
    client_reference_id: FAMILY,
    customer: CUSTOMER,
    subscription: "sub_1",
    metadata: { family_id: FAMILY },
    ...overrides,
  };
  return {
    id: eventId(),
    type: "checkout.session.completed",
    data: { object: session },
  };
}

function invoiceEvent(type: string, customer: string | null): StripeEvent {
  const invoice: StripeInvoice = {
    id: "in_1",
    customer,
    subscription: "sub_1",
  };
  return { id: eventId(), type, data: { object: invoice } };
}

beforeEach(() => {
  store = createMemorySubscriptionStore();
  counter = 0;
});

describe("subscribing", () => {
  it("records an active membership from a subscription event", async () => {
    const result = await applyStripeEvent(
      store,
      subscriptionEvent("customer.subscription.created"),
      prices,
    );
    expect(result.status).toBe("applied");

    const record = await store.getByFamilyId(FAMILY);
    expect(record?.status).toBe("active");
    expect(record?.plan).toBe("monthly");
    expect(record?.stripeSubscriptionId).toBe("sub_1");
    expect(hasPaidAccess(present(record))).toBe(true);
  });

  it("records a trial as trialing with access", async () => {
    await applyStripeEvent(
      store,
      subscriptionEvent("customer.subscription.updated", {
        status: "trialing",
      }),
      prices,
    );
    const record = await store.getByFamilyId(FAMILY);
    expect(record?.status).toBe("trialing");
    expect(hasPaidAccess(present(record))).toBe(true);
  });

  it("links the customer to the family at checkout completion", async () => {
    await applyStripeEvent(store, checkoutEvent(), prices);
    const record = await store.getByCustomerId(CUSTOMER);
    expect(record?.familyId).toBe(FAMILY);
  });
});

describe("failed and recovered payments", () => {
  it("moves an active membership to past_due but keeps access", async () => {
    await applyStripeEvent(
      store,
      subscriptionEvent("customer.subscription.updated", {
        status: "past_due",
      }),
      prices,
    );
    const record = await store.getByFamilyId(FAMILY);
    expect(record?.status).toBe("past_due");
    expect(hasPaidAccess(present(record))).toBe(true);
  });

  it("marks past_due from a failed invoice when in good standing", async () => {
    await applyStripeEvent(
      store,
      subscriptionEvent("customer.subscription.created"),
      prices,
    );
    await applyStripeEvent(
      store,
      invoiceEvent("invoice.payment_failed", CUSTOMER),
      prices,
    );
    expect((await store.getByFamilyId(FAMILY))?.status).toBe("past_due");
  });

  it("recovers to active on a succeeded invoice", async () => {
    await applyStripeEvent(
      store,
      subscriptionEvent("customer.subscription.updated", {
        status: "past_due",
      }),
      prices,
    );
    await applyStripeEvent(
      store,
      invoiceEvent("invoice.payment_succeeded", CUSTOMER),
      prices,
    );
    expect((await store.getByFamilyId(FAMILY))?.status).toBe("active");
  });

  it("never resurrects a canceled family from a stray invoice", async () => {
    await applyStripeEvent(
      store,
      subscriptionEvent("customer.subscription.deleted"),
      prices,
    );
    await applyStripeEvent(
      store,
      invoiceEvent("invoice.payment_succeeded", CUSTOMER),
      prices,
    );
    expect((await store.getByFamilyId(FAMILY))?.status).toBe("canceled");
  });
});

describe("cancelling", () => {
  it("carries the cancel-at-period-end flag while still active", async () => {
    await applyStripeEvent(
      store,
      subscriptionEvent("customer.subscription.updated", {
        cancel_at_period_end: true,
      }),
      prices,
    );
    const record = await store.getByFamilyId(FAMILY);
    expect(record?.status).toBe("active");
    expect(record?.cancelAtPeriodEnd).toBe(true);
    // Still has access until the period actually ends.
    expect(hasPaidAccess(present(record))).toBe(true);
  });

  it("ends access when the subscription is deleted", async () => {
    await applyStripeEvent(
      store,
      subscriptionEvent("customer.subscription.created"),
      prices,
    );
    await applyStripeEvent(
      store,
      subscriptionEvent("customer.subscription.deleted"),
      prices,
    );
    const record = await store.getByFamilyId(FAMILY);
    expect(record?.status).toBe("canceled");
    expect(record?.cancelAtPeriodEnd).toBe(false);
    expect(hasPaidAccess(present(record))).toBe(false);
  });
});

describe("family resolution", () => {
  it("resolves by stored customer when the event carries no metadata", async () => {
    await applyStripeEvent(store, checkoutEvent(), prices);
    await applyStripeEvent(
      store,
      subscriptionEvent("customer.subscription.updated", { metadata: null }),
      prices,
    );
    expect((await store.getByFamilyId(FAMILY))?.status).toBe("active");
  });

  it("reports unresolved when no family can be found", async () => {
    const result = await applyStripeEvent(
      store,
      subscriptionEvent("customer.subscription.updated", {
        metadata: null,
        customer: "cus_unknown",
      }),
      prices,
    );
    expect(result.status).toBe("unresolved");
  });
});

describe("idempotency", () => {
  it("treats a redelivered event id as a duplicate no-op", async () => {
    const event = subscriptionEvent("customer.subscription.updated", {
      cancel_at_period_end: true,
    });

    const first = await applyStripeEvent(store, event, prices);
    expect(first.status).toBe("applied");

    // A later real change, then the original event redelivered out of order.
    await applyStripeEvent(
      store,
      subscriptionEvent(
        "customer.subscription.updated",
        { cancel_at_period_end: false },
        "evt_later",
      ),
      prices,
    );
    const replay = await applyStripeEvent(store, event, prices);

    expect(replay.status).toBe("duplicate");
    // The replay did not roll the flag back to the original event's value.
    expect((await store.getByFamilyId(FAMILY))?.cancelAtPeriodEnd).toBe(false);
  });

  it("ignores event types it does not handle", async () => {
    const result = await applyStripeEvent(
      store,
      { id: eventId(), type: "customer.created", data: { object: {} } },
      prices,
    );
    expect(result.status).toBe("ignored");
  });

  it("releases the idempotency marker when application fails, so retries work", async () => {
    // The same store throughout: its upsert fails once, then succeeds — the
    // event id must not be remembered as processed after the failure, or the
    // retry would be wrongly skipped as a duplicate.
    const base = createMemorySubscriptionStore();
    let calls = 0;
    const flaky: SubscriptionStore = {
      ...base,
      upsert: (record) => {
        calls += 1;
        if (calls === 1) return Promise.reject(new Error("write failed"));
        return base.upsert(record);
      },
    };

    const event = subscriptionEvent("customer.subscription.created");
    await expect(applyStripeEvent(flaky, event, prices)).rejects.toThrow(
      "write failed",
    );

    const retry = await applyStripeEvent(flaky, event, prices);
    expect(retry.status).toBe("applied");
    expect((await base.getByFamilyId(FAMILY))?.status).toBe("active");
  });
});
