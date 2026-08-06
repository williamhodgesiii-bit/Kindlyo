import type {
  BillingGateway,
  CheckoutRequest,
  CheckoutSession,
  PortalRequest,
  PortalSession,
} from "./gateway";

/**
 * The real Stripe adapter, over the Stripe REST API with `fetch`.
 *
 * Reached only when billing is configured (a secret key is present); the app
 * otherwise runs without it. Like the PostgreSQL family store and the Supabase
 * auth gateway, this path is integration-level — covered by the types and the
 * `BillingGateway` interface rather than by offline unit tests, because it talks
 * to Stripe over the network. The tested logic (state machine, signature
 * verification, plan mapping, webhook dispatch) is all pure and lives elsewhere.
 *
 * The secret key is read once, on the server, and never leaves it. Requests are
 * form-encoded as the Stripe API expects, and the API version is pinned so a
 * Stripe-side default change cannot silently alter the payload shape.
 */

const STRIPE_API_BASE = "https://api.stripe.com/v1";
const STRIPE_API_VERSION = "2024-06-20";

type FormValue = string | number | boolean;

function encodeForm(fields: Record<string, FormValue | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) params.set(key, String(value));
  }
  return params.toString();
}

export function createStripeGateway(secretKey: string): BillingGateway {
  if (secretKey === "") {
    throw new Error("Stripe is not configured: missing secret key.");
  }

  async function post<T>(
    path: string,
    fields: Record<string, FormValue | undefined>,
  ): Promise<T> {
    const response = await fetch(`${STRIPE_API_BASE}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Version": STRIPE_API_VERSION,
      },
      body: encodeForm(fields),
    });

    if (!response.ok) {
      // Stripe returns a structured error; surface its message without leaking
      // the request (which could contain the customer email) into logs.
      const detail = (await response.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      throw new Error(
        `Stripe request to ${path} failed (${response.status})` +
          (detail?.error?.message ? `: ${detail.error.message}` : ""),
      );
    }

    return (await response.json()) as T;
  }

  return {
    async createCheckoutSession(
      request: CheckoutRequest,
    ): Promise<CheckoutSession> {
      const fields: Record<string, FormValue | undefined> = {
        mode: "subscription",
        "line_items[0][price]": request.priceId,
        "line_items[0][quantity]": 1,
        success_url: request.successUrl,
        cancel_url: request.cancelUrl,
        // Both are read back in the webhook to resolve the family without
        // trusting the browser; the subscription metadata makes later
        // subscription events self-describing too.
        client_reference_id: request.familyId,
        "metadata[family_id]": request.familyId,
        "subscription_data[metadata][family_id]": request.familyId,
      };

      // Reuse the family's customer when we have one; otherwise let Stripe
      // create it from the email and report it back via the webhook.
      if (request.customerId !== null) {
        fields.customer = request.customerId;
      } else {
        fields.customer_email = request.customerEmail;
      }

      const session = await post<{
        url: string | null;
        customer: string | null;
      }>("/checkout/sessions", fields);
      if (session.url === null) {
        throw new Error("Stripe did not return a Checkout URL.");
      }
      return { url: session.url, customerId: session.customer };
    },

    async createPortalSession(request: PortalRequest): Promise<PortalSession> {
      const session = await post<{ url: string }>("/billing_portal/sessions", {
        customer: request.customerId,
        return_url: request.returnUrl,
      });
      return { url: session.url };
    },
  };
}
