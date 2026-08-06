import { billingMode } from "@/features/subscriptions/config";
import { isDevRouteEnabled } from "@/lib/devOnly";
import { getFamilyStore } from "@/server/families";
import {
  badRequest,
  currentUser,
  jsonResponse,
  notFoundResponse,
  readJsonBody,
  unauthorized,
} from "@/server/families/http";
import { getSubscriptionStore } from "@/server/subscriptions";
import {
  DEV_PRICE_MAP,
  isDevScenario,
  simulateEvent,
} from "@/server/subscriptions/devSimulator";
import { getBillingService } from "@/server/subscriptions/service";
import { applyStripeEvent } from "@/server/subscriptions/webhook";

/**
 * Development-only subscription simulation.
 *
 * The offline "test mode": with no Stripe configured locally, this stands in for
 * the webhook by feeding a synthesised event through the real dispatcher, so a
 * developer can walk a family through active, past-due, and cancelled states and
 * see entitlement and the customer-facing copy respond. Gated three ways — the
 * dev server (`isDevRouteEnabled`), local billing mode (`dev`), and a signed-in
 * parent — so it can never run in a deployed app.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isDevRouteEnabled() || billingMode() !== "dev") {
    return notFoundResponse();
  }

  const user = await currentUser();
  if (user === null) return unauthorized();

  const body = await readJsonBody(request);
  const scenario = (body as { scenario?: unknown } | undefined)?.scenario;
  if (!isDevScenario(scenario)) return badRequest("invalid-scenario");

  const familyId = await getFamilyStore().ensureFamily(user.id);
  await applyStripeEvent(
    getSubscriptionStore(),
    simulateEvent(familyId, scenario),
    DEV_PRICE_MAP,
  );

  return jsonResponse(await getBillingService().getBilling(user));
}
