import {
  currentUser,
  jsonResponse,
  unauthorized,
} from "@/server/families/http";
import { getBillingService } from "@/server/subscriptions/service";

/**
 * Opens the Stripe Billing Portal for the signed-in parent's family.
 *
 * The portal is where a parent updates a card, changes plan, or cancels — Stripe
 * hosts all of it, so cancellation and payment recovery need no bespoke UI here
 * (docs/BILLING.md). Returns the portal URL for the browser to redirect to.
 */
export const dynamic = "force-dynamic";

export async function POST() {
  const user = await currentUser();
  if (user === null) return unauthorized();

  const result = await getBillingService().startPortal(user);
  if (result.ok) return jsonResponse({ url: result.url });

  // 503: billing off in this environment. 409: no subscription to manage.
  const status = result.reason === "not-available" ? 503 : 409;
  return jsonResponse({ error: result.reason }, status);
}
