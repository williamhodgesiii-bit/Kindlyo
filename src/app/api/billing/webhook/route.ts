import { getPriceMap } from "@/features/subscriptions/config";
import type { StripeEvent } from "@/features/subscriptions/events";
import { verifyStripeSignature } from "@/features/subscriptions/webhookSignature";
import { env } from "@/lib/env";
import { badRequest, jsonResponse } from "@/server/families/http";
import { getSubscriptionStore } from "@/server/subscriptions";
import { applyStripeEvent } from "@/server/subscriptions/webhook";

/**
 * The Stripe webhook endpoint.
 *
 * Runs on the Node.js runtime because it needs the raw request body and Node's
 * crypto to verify the signature. The order is the whole security story
 * (docs/BILLING.md): read the raw bytes, verify the `Stripe-Signature` against
 * the signing secret, and only then parse and act. An unverified body is never
 * trusted, and the dispatcher makes the effect idempotent so a Stripe redelivery
 * changes nothing.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!env.billingConfigured || env.STRIPE_WEBHOOK_SECRET === null) {
    return jsonResponse({ error: "billing-not-configured" }, 503);
  }

  // Raw body first — parsing before verifying would trust unverified input.
  const payload = await request.text();
  const verification = verifyStripeSignature({
    payload,
    header: request.headers.get("stripe-signature"),
    secret: env.STRIPE_WEBHOOK_SECRET,
  });
  if (!verification.ok) {
    return jsonResponse({ error: "invalid-signature" }, 400);
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return badRequest("invalid-json");
  }
  if (typeof event.id !== "string" || typeof event.type !== "string") {
    return badRequest("invalid-event");
  }

  try {
    const result = await applyStripeEvent(
      getSubscriptionStore(),
      event,
      getPriceMap(),
    );
    if (result.status === "unresolved") {
      // Signature was valid but the event carried no family we could match.
      // Not retryable, so acknowledge — but make it visible.
      console.warn(
        JSON.stringify({
          event: "billing.webhook.unresolved",
          type: result.type,
          id: event.id,
        }),
      );
    }
    return jsonResponse({ received: true, status: result.status });
  } catch (error) {
    // Application failed after the event was recorded; the dispatcher has
    // already released the idempotency marker, so a non-2xx asks Stripe to retry.
    console.error("billing.webhook.failed", error);
    return jsonResponse({ error: "processing-failed" }, 500);
  }
}
