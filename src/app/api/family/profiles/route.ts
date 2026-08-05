import {
  currentUser,
  jsonResponse,
  readJsonBody,
  unauthorized,
} from "@/server/families/http";
import { parseProfileDraft } from "@/server/families/requests";
import { getFamilyService } from "@/server/families/service";

/**
 * Creates a child profile in the signed-in parent's family. The three-profile
 * cap and nickname trimming are the store's to enforce; this only checks the
 * body's shape, then hands the parent (never a family id) to the service.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await currentUser();
  if (user === null) return unauthorized();

  const draft = parseProfileDraft(await readJsonBody(request));
  if (!draft.ok)
    return jsonResponse({ ok: false, reason: "empty-nickname" }, 400);

  const result = await getFamilyService().createProfile(user, draft.value);
  if (result.ok) {
    return jsonResponse({
      ok: true,
      state: result.state,
      profile: result.profile,
    });
  }
  return jsonResponse(
    { ok: false, reason: result.reason },
    result.reason === "limit" ? 409 : 400,
  );
}
