import { NextResponse } from "next/server";
import { currentUser, unauthorized } from "@/server/families/http";
import { getFamilyService } from "@/server/families/service";

/**
 * The parent's data export (docs/PRIVACY_AND_SAFETY.md).
 *
 * A download of everything the account holds about their family — their own
 * email, their children's profiles, and each child's progress — as pretty JSON.
 * Scoped to the session like every family route: the export is resolved from the
 * signed-in parent's user id, never from anything the browser sends. The
 * `Content-Disposition` makes the browser save it rather than render it, and it
 * is never cached (it is private, per-parent data).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  if (user === null) return unauthorized();

  const data = await getFamilyService().exportAccount(user);
  return new NextResponse(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition":
        'attachment; filename="kindlyo-account-export.json"',
      "cache-control": "no-store",
    },
  });
}
