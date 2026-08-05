import {
  currentUser,
  jsonResponse,
  unauthorized,
} from "@/server/families/http";
import { getFamilyService } from "@/server/families/service";

/** Records that the parent has been through onboarding, so it stops asking. */
export const dynamic = "force-dynamic";

export async function POST() {
  const user = await currentUser();
  if (user === null) return unauthorized();
  return jsonResponse({
    state: await getFamilyService().completeOnboarding(user),
  });
}
