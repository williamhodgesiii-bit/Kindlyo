import { env, type AppEnvironment } from "@/lib/env";
import type { BillingGateway } from "./gateway";
import type { PriceMap } from "./plans";
import { createStripeGateway } from "./stripeGateway";

/**
 * How the app chooses its billing configuration, mirroring `getFamilyStore` and
 * `getServerAuthGateway`.
 *
 * There are three modes, and every subscription surface branches on exactly this
 * one value:
 *
 * - `live` — billing is fully configured; real Stripe Checkout and Portal.
 * - `dev` — local development without Stripe keys; the flow is exercised with a
 *   simulator (`/api/billing/dev-activate`) instead of real payments, so the
 *   subscription states and entitlement can be built and reviewed offline.
 * - `unavailable` — deployed but not configured. Subscriptions are simply off:
 *   entitlement is the free plan for everyone and checkout/portal say so.
 */
export type BillingMode = "live" | "dev" | "unavailable";

export function billingMode(
  appEnv: AppEnvironment = env.APP_ENV,
  configured: boolean = env.billingConfigured,
): BillingMode {
  if (configured) return "live";
  if (appEnv === "local") return "dev";
  return "unavailable";
}

/** The plan → Stripe Price ID map for the current environment. */
export function getPriceMap(): PriceMap {
  return {
    monthly: env.STRIPE_PRICE_ID_MONTHLY,
    annual: env.STRIPE_PRICE_ID_ANNUAL,
  };
}

let cachedGateway: BillingGateway | null = null;

/** The real Stripe gateway when billing is configured, otherwise null. */
export function getBillingGateway(): BillingGateway | null {
  if (!env.billingConfigured || env.STRIPE_SECRET_KEY === null) return null;
  cachedGateway ??= createStripeGateway(env.STRIPE_SECRET_KEY);
  return cachedGateway;
}
