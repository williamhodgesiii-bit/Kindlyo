import {
  badRequest,
  currentUser,
  jsonResponse,
  notFoundResponse,
  readJsonBody,
  unauthorized,
} from "@/server/families/http";
import { parseMissionBody } from "@/server/families/requests";
import { getFamilyService } from "@/server/families/service";

/**
 * The offline mission's status, marked by the parent from their dashboard
 * (decision 023). Binary: "done" or, with `status: null`, back to suggested.
 * This deliberately does not move the child's activity clock (decision 029).
 */
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ profileId: string }> };

export async function PUT(request: Request, context: Context) {
  const user = await currentUser();
  if (user === null) return unauthorized();
  const { profileId } = await context.params;

  const body = parseMissionBody(await readJsonBody(request));
  if (!body.ok) return badRequest();

  const result = await getFamilyService().setMissionStatus(
    user,
    profileId,
    body.value.lessonId,
    body.value.status,
  );
  if (!result.ok) return notFoundResponse();
  return jsonResponse({ ok: true });
}
