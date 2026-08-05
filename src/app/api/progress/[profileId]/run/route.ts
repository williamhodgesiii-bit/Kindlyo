import {
  badRequest,
  currentUser,
  jsonResponse,
  notFoundResponse,
  readJsonBody,
  unauthorized,
} from "@/server/families/http";
import { parseRunBody } from "@/server/families/requests";
import { getFamilyService } from "@/server/families/service";

/**
 * A child's mid-lesson position: save it (PUT) or drop it (DELETE). The run is
 * version-tagged so a lesson revision can discard it; the completion record it
 * may leave behind survives, and lives elsewhere.
 */
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ profileId: string }> };

export async function PUT(request: Request, context: Context) {
  const user = await currentUser();
  if (user === null) return unauthorized();
  const { profileId } = await context.params;

  const body = parseRunBody(await readJsonBody(request));
  if (!body.ok) return badRequest();

  const result = await getFamilyService().saveRun(
    user,
    profileId,
    body.value.lessonId,
    body.value.lessonVersion,
    body.value.state,
  );
  if (!result.ok) return notFoundResponse();
  return jsonResponse({ ok: true });
}

export async function DELETE(request: Request, context: Context) {
  const user = await currentUser();
  if (user === null) return unauthorized();
  const { profileId } = await context.params;

  const lessonId = new URL(request.url).searchParams.get("lessonId");
  if (lessonId === null || lessonId === "") return badRequest();

  const result = await getFamilyService().clearRun(user, profileId, lessonId);
  if (!result.ok) return notFoundResponse();
  return jsonResponse({ ok: true });
}
