import { isSubscriptionPlan } from "@/features/subscriptions/plans";
import {
  badRequest,
  currentUser,
  jsonResponse,
  readJsonBody,
  unauthorized,
} from "@/server/families/http";
import { getBillingService } from "@/server/subscriptions/service";

/**
 * Starts Stripe Checkout for the signed-in parent's family.
 *
 * Returns the hosted Checkout URL for the browser to redirect to; the card is
 * entered on Stripe, never here. Refuses to double-sell to a family that already
 * has an active membership (one subscription per family), and reports plainly
 * when billing is not available in this environment.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await currentUser();
  if (user === null) return unauthorized();

  const body = await readJsonBody(request);
  const plan = (body as { plan?: unknown } | undefined)?.plan;
  if (!isSubscriptionPlan(plan)) return badRequest("invalid-plan");

  const result = await getBillingService().startCheckout(user, plan);
  if (result.ok) return jsonResponse({ url: result.url });

  // 503: billing off in this environment. 409: already subscribed.
  const status = result.reason === "not-available" ? 503 : 409;
  return jsonResponse({ error: result.reason }, status);
}
