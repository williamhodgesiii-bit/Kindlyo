import type { Page } from "@playwright/test";

/**
 * Seeding local demo profiles for end-to-end specs.
 *
 * Most specs need a child profile to exist before they can reach a lesson, but
 * only one of them is actually about creating profiles. Seeding through
 * `addInitScript` writes the same local-storage shape the app writes, before
 * the first script on the page runs, so the app hydrates straight into the
 * state under test.
 *
 * `e2e/progress.spec.ts` deliberately does NOT use this for its first journey:
 * it creates profiles through the parent UI, so the real path is covered too.
 */

const PROFILE_KEY = "kindlyo.prototype.profiles.v1";

export type SeededProfile = { id: string; nickname: string };

/**
 * Seeds profiles and selects the first one.
 *
 * Ids are fixed strings rather than UUIDs so a spec can assert against them.
 */
export async function seedProfiles(
  page: Page,
  nicknames: readonly string[],
): Promise<SeededProfile[]> {
  const profiles = nicknames.map((nickname, index) => ({
    id: `e2e-profile-${index}`,
    nickname,
    ageBand: "5–6",
    createdAt: "2026-08-04T09:00:00.000Z",
  }));

  await page.addInitScript(
    ([key, state]) => {
      // Seed once, not on every navigation: an init script runs before every
      // page load, and overwriting each time would silently undo anything the
      // app had written — a profile switch, for instance.
      if (window.localStorage.getItem(key as string) === null) {
        window.localStorage.setItem(key as string, state as string);
      }
    },
    [
      PROFILE_KEY,
      JSON.stringify({
        profiles,
        selectedProfileId: profiles[0]?.id ?? null,
        // Seeded families are past onboarding; the onboarding flow has its own
        // spec that starts from nothing.
        onboardedAt: "2026-08-04T09:00:00.000Z",
      }),
    ],
  );

  return profiles.map(({ id, nickname }) => ({ id, nickname }));
}
