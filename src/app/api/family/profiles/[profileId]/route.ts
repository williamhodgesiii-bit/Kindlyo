import {
  badRequest,
  currentUser,
  jsonResponse,
  notFoundResponse,
  readJsonBody,
  unauthorized,
} from "@/server/families/http";
import { parseProfilePatch } from "@/server/families/requests";
import { getFamilyService } from "@/server/families/service";

/**
 * Editing and deleting one child profile. The id is a path segment the service
 * re-checks against the parent's family before it touches anything, so a
 * profile in another family reads exactly like one that does not exist.
 *
 * Delete is a hard cascade (decision 035): the profile's progress and mission
 * marks go with it.
 */
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ profileId: string }> };

export async function PATCH(request: Request, context: Context) {
  const user = await currentUser();
  if (user === null) return unauthorized();
  const { profileId } = await context.params;

  const patch = parseProfilePatch(await readJsonBody(request));
  if (!patch.ok) return badRequest();

  const result = await getFamilyService().updateProfile(
    user,
    profileId,
    patch.value,
  );
  if (result.ok) {
    return jsonResponse({
      ok: true,
      state: result.state,
      profile: result.profile,
    });
  }
  return jsonResponse(
    { ok: false, reason: result.reason },
    result.reason === "not-found" ? 404 : 400,
  );
}

export async function DELETE(_request: Request, context: Context) {
  const user = await currentUser();
  if (user === null) return unauthorized();
  const { profileId } = await context.params;

  const result = await getFamilyService().deleteProfile(user, profileId);
  if (!result.ok) return notFoundResponse();
  return jsonResponse({ state: result.state });
}
