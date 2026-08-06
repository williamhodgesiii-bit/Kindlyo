import { beforeEach, describe, expect, it } from "vitest";
import type {
  BillingGateway,
  CheckoutRequest,
  PortalRequest,
} from "@/features/subscriptions/gateway";
import type { PriceMap } from "@/features/subscriptions/plans";
import type { AuthUser } from "@/features/auth/types";
import { createMemorySubscriptionStore } from "./memoryStore";
import { createBillingService } from "./service";
import type { SubscriptionRecord, SubscriptionStore } from "./store";

/**
 * The billing service as the authorization boundary. The family is resolved from
 * the user id alone (a stub that maps each user to their own family), so these
 * prove the same cross-family scoping `FamilyService` does: parent A never
 * reaches parent B's subscription.
 */

const prices: PriceMap = { monthly: "price_m", annual: "price_a" };
const appUrl = "https://app.test";

const parentA: AuthUser = { id: "user-a", email: "a@example.com" };
const parentB: AuthUser = { id: "user-b", email: "b@example.com" };

const families = {
  ensureFamily: (userId: string) => Promise.resolve(`fam-${userId}`),
};

function recordingGateway(): {
  gateway: BillingGateway;
  checkouts: CheckoutRequest[];
  portals: PortalRequest[];
} {
  const checkouts: CheckoutRequest[] = [];
  const portals: PortalRequest[] = [];
  return {
    checkouts,
    portals,
    gateway: {
      createCheckoutSession(request) {
        checkouts.push(request);
        return Promise.resolve({
          url: "https://stripe.test/checkout",
          customerId: "cus_new",
        });
      },
      createPortalSession(request) {
        portals.push(request);
        return Promise.resolve({ url: "https://stripe.test/portal" });
      },
    },
  };
}

function activeRecord(familyId: string): SubscriptionRecord {
  return {
    familyId,
    status: "active",
    plan: "monthly",
    currentPeriodEnd: "2026-01-01T00:00:00.000Z",
    cancelAtPeriodEnd: false,
    stripeCustomerId: "cus_existing",
    stripeSubscriptionId: "sub_existing",
    updatedAt: null,
  };
}

let store: SubscriptionStore;

beforeEach(() => {
  store = createMemorySubscriptionStore();
});

describe("getBilling", () => {
  it("returns the free plan for a family with no record", async () => {
    const service = createBillingService({
      subscriptions: store,
      families,
      gateway: null,
      prices,
      appUrl,
    });
    const state = await service.getBilling(parentA);
    expect(state.status).toBe("free");
    expect(state.hasPaidAccess).toBe(false);
  });

  it("does not leak another family's subscription", async () => {
    await store.upsert(activeRecord("fam-user-b"));
    const service = createBillingService({
      subscriptions: store,
      families,
      gateway: null,
      prices,
      appUrl,
    });

    // Parent B is subscribed; parent A resolves to a different family and sees free.
    expect((await service.getBilling(parentB)).status).toBe("active");
    expect((await service.getBilling(parentA)).status).toBe("free");
    expect(await service.hasAccess(parentA)).toBe(false);
  });
});

describe("startCheckout", () => {
  it("opens a checkout session scoped to the parent's family", async () => {
    const { gateway, checkouts } = recordingGateway();
    const service = createBillingService({
      subscriptions: store,
      families,
      gateway,
      prices,
      appUrl,
    });

    const result = await service.startCheckout(parentA, "annual");
    expect(result).toEqual({ ok: true, url: "https://stripe.test/checkout" });
    expect(checkouts).toHaveLength(1);
    expect(checkouts[0]).toMatchObject({
      familyId: "fam-user-a",
      plan: "annual",
      priceId: "price_a",
      customerEmail: "a@example.com",
      successUrl: "https://app.test/parent/billing?status=success",
    });
    // The returned customer is linked so the portal works before the webhook.
    expect((await store.getByFamilyId("fam-user-a"))?.stripeCustomerId).toBe(
      "cus_new",
    );
  });

  it("refuses to double-sell to a family with an active membership", async () => {
    await store.upsert(activeRecord("fam-user-a"));
    const { gateway, checkouts } = recordingGateway();
    const service = createBillingService({
      subscriptions: store,
      families,
      gateway,
      prices,
      appUrl,
    });

    const result = await service.startCheckout(parentA, "monthly");
    expect(result).toEqual({ ok: false, reason: "already-subscribed" });
    expect(checkouts).toHaveLength(0);
  });

  it("reports not-available when billing has no gateway", async () => {
    const service = createBillingService({
      subscriptions: store,
      families,
      gateway: null,
      prices,
      appUrl,
    });
    expect(await service.startCheckout(parentA, "monthly")).toEqual({
      ok: false,
      reason: "not-available",
    });
  });
});

describe("startPortal", () => {
  it("opens the portal for a family with a customer", async () => {
    await store.upsert(activeRecord("fam-user-a"));
    const { gateway, portals } = recordingGateway();
    const service = createBillingService({
      subscriptions: store,
      families,
      gateway,
      prices,
      appUrl,
    });

    const result = await service.startPortal(parentA);
    expect(result).toEqual({ ok: true, url: "https://stripe.test/portal" });
    expect(portals[0]).toEqual({
      customerId: "cus_existing",
      returnUrl: "https://app.test/parent/billing",
    });
  });

  it("reports no-subscription when the family has no customer", async () => {
    const { gateway } = recordingGateway();
    const service = createBillingService({
      subscriptions: store,
      families,
      gateway,
      prices,
      appUrl,
    });
    expect(await service.startPortal(parentA)).toEqual({
      ok: false,
      reason: "no-subscription",
    });
  });
});
