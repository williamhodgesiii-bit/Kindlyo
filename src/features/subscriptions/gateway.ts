import type { SubscriptionPlan } from "./types";

/**
 * The outbound Stripe port.
 *
 * The only two calls the app makes TO Stripe: open a Checkout Session so a
 * parent can subscribe, and open a Billing Portal session so they can manage or
 * cancel. Card details are entered on Stripe's own hosted pages, so no card data
 * ever touches this app (docs/BILLING.md).
 *
 * This is the same seam pattern as `AuthGateway` (decision 033) and
 * `FamilyStore` (decision 034): an interface with a real Stripe adapter
 * (`stripeGateway.ts`) chosen by configuration in `config.ts`. Inbound webhooks
 * are handled separately — they are verified in the route and applied by
 * `src/server/subscriptions/webhook.ts`, not through this port.
 */

export type CheckoutRequest = {
  familyId: string;
  plan: SubscriptionPlan;
  priceId: string;
  /** Reuse an existing Stripe customer when the family already has one. */
  customerId: string | null;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutSession = {
  url: string;
  /** The customer Stripe used, so it can be linked to the family early. */
  customerId: string | null;
};

export type PortalRequest = {
  customerId: string;
  returnUrl: string;
};

export type PortalSession = {
  url: string;
};

export interface BillingGateway {
  createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession>;
  createPortalSession(request: PortalRequest): Promise<PortalSession>;
}
