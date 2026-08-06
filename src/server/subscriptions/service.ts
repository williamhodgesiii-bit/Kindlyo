import {
  getBillingGateway,
  getPriceMap,
} from "@/features/subscriptions/config";
import type { BillingGateway } from "@/features/subscriptions/gateway";
import { priceIdForPlan, type PriceMap } from "@/features/subscriptions/plans";
import {
  freeSubscription,
  hasPaidAccess,
  toBillingState,
} from "@/features/subscriptions/subscription";
import type {
  BillingState,
  SubscriptionPlan,
} from "@/features/subscriptions/types";
import type { AuthUser } from "@/features/auth/types";
import { env } from "@/lib/env";
import { getFamilyStore } from "@/server/families";
import type { FamilyStore } from "@/server/families/store";
import { getSubscriptionStore } from "./index";
import type { SubscriptionStore } from "./store";

/**
 * The authorization boundary for subscriptions — the subscriptions analogue of
 * `FamilyService` (decision 034).
 *
 * The routes call only this. It resolves the parent's family from their user id
 * alone (never a `familyId` from the browser), and every read and write is
 * scoped to that family. Because a family is resolved the same way here as in
 * `FamilyService`, parent A can never reach parent B's subscription — proven in
 * `service.test.ts`. Entitlement (`hasPaidAccess`) is always computed on the
 * server from the stored record; the browser's copy is a display value only.
 */

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: "not-available" | "already-subscribed" };

export type PortalResult =
  | { ok: true; url: string }
  | { ok: false; reason: "not-available" | "no-subscription" };

export type BillingService = {
  getBilling(user: AuthUser): Promise<BillingState>;
  hasAccess(user: AuthUser): Promise<boolean>;
  startCheckout(
    user: AuthUser,
    plan: SubscriptionPlan,
  ): Promise<CheckoutResult>;
  startPortal(user: AuthUser): Promise<PortalResult>;
};

export type BillingServiceDeps = {
  subscriptions: SubscriptionStore;
  families: Pick<FamilyStore, "ensureFamily">;
  gateway: BillingGateway | null;
  prices: PriceMap;
  appUrl: string;
};

export function createBillingService(deps: BillingServiceDeps): BillingService {
  const { subscriptions, families, gateway, prices, appUrl } = deps;
  const successUrl = `${appUrl}/parent/billing?status=success`;
  const cancelUrl = `${appUrl}/parent/billing?status=canceled`;
  const returnUrl = `${appUrl}/parent/billing`;

  async function getBilling(user: AuthUser): Promise<BillingState> {
    const familyId = await families.ensureFamily(user.id);
    const record = await subscriptions.getByFamilyId(familyId);
    return toBillingState(record ?? freeSubscription);
  }

  return {
    getBilling,

    async hasAccess(user) {
      return (await getBilling(user)).hasPaidAccess;
    },

    async startCheckout(user, plan) {
      const familyId = await families.ensureFamily(user.id);
      const existing = await subscriptions.getByFamilyId(familyId);
      // One subscription per family: an active membership is not double-bought.
      if (existing !== null && hasPaidAccess(existing)) {
        return { ok: false, reason: "already-subscribed" };
      }
      if (gateway === null) return { ok: false, reason: "not-available" };
      const priceId = priceIdForPlan(plan, prices);
      if (priceId === null) return { ok: false, reason: "not-available" };

      const session = await gateway.createCheckoutSession({
        familyId,
        plan,
        priceId,
        customerId: existing?.stripeCustomerId ?? null,
        customerEmail: user.email,
        successUrl,
        cancelUrl,
      });
      // Link the customer early so the portal works even before the webhook lands.
      if (session.customerId !== null) {
        await subscriptions.linkCustomer(familyId, session.customerId);
      }
      return { ok: true, url: session.url };
    },

    async startPortal(user) {
      const familyId = await families.ensureFamily(user.id);
      const existing = await subscriptions.getByFamilyId(familyId);
      if (existing === null || existing.stripeCustomerId === null) {
        return { ok: false, reason: "no-subscription" };
      }
      if (gateway === null) return { ok: false, reason: "not-available" };
      const session = await gateway.createPortalSession({
        customerId: existing.stripeCustomerId,
        returnUrl,
      });
      return { ok: true, url: session.url };
    },
  };
}

let cached: BillingService | null = null;

/** The app's billing service, wired to the configured stores and gateway. */
export function getBillingService(): BillingService {
  cached ??= createBillingService({
    subscriptions: getSubscriptionStore(),
    families: getFamilyStore(),
    gateway: getBillingGateway(),
    prices: getPriceMap(),
    appUrl: env.NEXT_PUBLIC_APP_URL,
  });
  return cached;
}
