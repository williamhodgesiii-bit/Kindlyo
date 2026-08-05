import {
  badRequest,
  currentUser,
  jsonResponse,
  notFoundResponse,
  readJsonBody,
  unauthorized,
} from "@/server/families/http";
import { parseSelection } from "@/server/families/requests";
import { getFamilyService } from "@/server/families/service";

/**
 * Which child is learning right now. Selecting requires the profile to belong
 * to the parent's family; a foreign id is `not-found`, so a parent cannot point
 * their session at another family's child. Deselecting (null) is always fine.
 */
export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const user = await currentUser();
  if (user === null) return unauthorized();

  const parsed = parseSelection(await readJsonBody(request));
  if (!parsed.ok) return badRequest();

  const result = await getFamilyService().selectProfile(user, parsed.value);
  if (!result.ok) return notFoundResponse();
  return jsonResponse({ state: result.state });
}
