import {
  currentUser,
  jsonResponse,
  notFoundResponse,
  unauthorized,
} from "@/server/families/http";
import { getFamilyService } from "@/server/families/service";

/**
 * One child's progress: read it, or reset it. Both verify the profile belongs
 * to the signed-in parent's family first; a foreign id is `not-found` and
 * touches nothing.
 */
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ profileId: string }> };

export async function GET(_request: Request, context: Context) {
  const user = await currentUser();
  if (user === null) return unauthorized();
  const { profileId } = await context.params;

  const result = await getFamilyService().getProgress(user, profileId);
  if (!result.ok) return notFoundResponse();
  return jsonResponse(result.progress);
}

export async function DELETE(_request: Request, context: Context) {
  const user = await currentUser();
  if (user === null) return unauthorized();
  const { profileId } = await context.params;

  const result = await getFamilyService().resetProgress(user, profileId);
  if (!result.ok) return notFoundResponse();
  return jsonResponse({ ok: true });
}
