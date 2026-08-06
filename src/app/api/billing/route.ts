import {
  currentUser,
  jsonResponse,
  unauthorized,
} from "@/server/families/http";
import { getBillingService } from "@/server/subscriptions/service";

/**
 * The signed-in parent's subscription state, resolved from their session.
 *
 * A read-only projection with no Stripe identifiers (see `BillingState`). The
 * family is resolved from the user id, never from anything the browser sends,
 * and entitlement is computed on the server.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  if (user === null) return unauthorized();
  return jsonResponse(await getBillingService().getBilling(user));
}
