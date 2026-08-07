import { expect, test, type Page } from "@playwright/test";
import { STORAGE_STATE } from "./support/auth";
import { seedProfiles } from "./support/family";

// The parent and learning areas are gated: reuse the signed-in parent session.
test.use({ storageState: STORAGE_STATE });

/**
 * The Missions and Skills sections, driven with real progress in a production
 * build. Their rendering logic is unit-tested; this proves the routes, the
 * navigation, and the play-through → section-data path end to end.
 */

/** Play lesson one, picking the "it depends" option so a talking point appears. */
async function completeLessonOne(page: Page) {
  await page.goto("/learn");
  await page.getByRole("link", { name: "Start lesson 1", exact: true }).click();

  const next = page.getByRole("button", { name: "Next" });
  await next.click();
  await page
    .getByRole("button", { name: /Wave, without saying anything/ })
    .click();
  await next.click();
  await next.click();
  await page.getByRole("button", { name: "Wave", exact: true }).click();
  await next.click();
  await next.click();
  await next.click();

  await expect(
    page.getByRole("heading", { name: /You finished/ }),
  ).toBeVisible();
}

test.describe("parent missions & skills sections", () => {
  test.beforeEach(async ({ page }) => {
    await seedProfiles(page, ["Ada"]);
    await completeLessonOne(page);
  });

  test("Missions shows the week's mission and the conversation prompt", async ({
    page,
  }) => {
    await page.goto("/parent/missions");

    await expect(
      page.getByRole("heading", { name: "Missions", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Saying hello" }),
    ).toBeVisible();
    // The "it depends" choice surfaced a conversation starter, not a correction.
    await expect(page.getByText("Worth talking about")).toBeVisible();

    // The mission can be marked practised, in place.
    await page.getByRole("button", { name: /Mark as done/ }).click();
    await expect(page.getByText("Done")).toBeVisible();
  });

  test("Skills shows the areas and offers finished lessons for review", async ({
    page,
  }) => {
    await page.goto("/parent/skills");

    await expect(
      page.getByRole("heading", { name: "Skills", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Skill areas" }),
    ).toBeVisible();

    const review = page.getByRole("region", { name: "Ready to review" });
    await expect(review.getByText("Saying hello")).toBeVisible();
  });

  test("the parent nav reaches both sections", async ({ page }) => {
    await page.goto("/parent");

    await page.getByRole("link", { name: "Missions" }).click();
    await expect(page).toHaveURL(/\/parent\/missions$/);

    await page.getByRole("link", { name: "Skills" }).click();
    await expect(page).toHaveURL(/\/parent\/skills$/);
  });
});
