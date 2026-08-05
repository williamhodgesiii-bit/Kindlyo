import {
  badRequest,
  currentUser,
  jsonResponse,
  notFoundResponse,
  readJsonBody,
  unauthorized,
} from "@/server/families/http";
import { parseCompletionBody } from "@/server/families/requests";
import { getFamilyService } from "@/server/families/service";

/**
 * Marks a lesson complete for one child. First completion wins — the service
 * keeps the original timestamp when a lesson is replayed (decision 022).
 */
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ profileId: string }> };

export async function POST(request: Request, context: Context) {
  const user = await currentUser();
  if (user === null) return unauthorized();
  const { profileId } = await context.params;

  const body = parseCompletionBody(await readJsonBody(request));
  if (!body.ok) return badRequest();

  const result = await getFamilyService().recordCompletion(
    user,
    profileId,
    body.value.lessonId,
    body.value.lessonVersion,
    body.value.completedAt,
  );
  if (!result.ok) return notFoundResponse();
  return jsonResponse({ ok: true });
}
