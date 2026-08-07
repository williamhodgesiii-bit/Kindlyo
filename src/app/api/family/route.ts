import {
  currentUser,
  jsonResponse,
  unauthorized,
} from "@/server/families/http";
import { getFamilyService } from "@/server/families/service";

/**
 * The signed-in parent's family: their child profiles, the active selection,
 * and whether onboarding is done. Scoped to the session — the parent's family
 * is resolved from their user id, never from anything the browser sends.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  if (user === null) return unauthorized();
  return jsonResponse(await getFamilyService().getFamily(user));
}

/**
 * Delete the account: the parent's whole family and everything under it
 * (docs/PRIVACY_AND_SAFETY.md). The client ends the session immediately after —
 * the data is gone, and there is nothing left to stay signed in to.
 */
export async function DELETE() {
  const user = await currentUser();
  if (user === null) return unauthorized();
  return jsonResponse(await getFamilyService().deleteAccount(user));
}
