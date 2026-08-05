import type { Page } from "@playwright/test";

/**
 * Seeding a family for end-to-end specs — now through the API.
 *
 * Profiles and progress live in the database (or, offline, the server's
 * in-memory store), not in the browser, so a spec can no longer write local
 * storage to arrive in a state. It POSTs through the same authenticated routes
 * the app uses, as the signed-in parent the auth setup established, so the real
 * scoping runs too.
 *
 * The family is cleared first so seeding is idempotent within a shared session.
 * `e2e/progress.spec.ts` still creates its first journey's profiles through the
 * parent UI, so the real creation path stays covered.
 */

export type SeededProfile = { id: string; nickname: string };

async function clearFamily(page: Page): Promise<void> {
  const response = await page.request.get("/api/family");
  if (!response.ok()) return;
  const family = (await response.json()) as { profiles?: { id: string }[] };
  for (const profile of family.profiles ?? []) {
    await page.request.delete(`/api/family/profiles/${profile.id}`);
  }
}

/**
 * Seeds profiles for the signed-in parent and selects the first one. Returns
 * the created profiles with their server-assigned ids.
 */
export async function seedProfiles(
  page: Page,
  nicknames: readonly string[],
): Promise<SeededProfile[]> {
  await clearFamily(page);

  const created: SeededProfile[] = [];
  for (const nickname of nicknames) {
    const response = await page.request.post("/api/family/profiles", {
      data: { nickname, ageBand: "5–6" },
    });
    const body = (await response.json()) as { profile?: { id: string } };
    if (body.profile === undefined) {
      throw new Error(`could not seed profile "${nickname}"`);
    }
    created.push({ id: body.profile.id, nickname });
  }

  // Seeded families are past onboarding, with the first child chosen. The
  // onboarding and picker flows have their own specs that start from empty.
  if (created[0] !== undefined) {
    await page.request.put("/api/family/selection", {
      data: { profileId: created[0].id },
    });
  }
  await page.request.post("/api/family/onboarding");

  return created;
}
