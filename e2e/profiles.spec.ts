import { expect, test, type Page } from "@playwright/test";
import { seedProfiles } from "./support/family";

/**
 * The family flow end to end: welcome, onboarding, creating, editing,
 * deleting, choosing a child, and getting back to the parent area.
 *
 * Starts from an empty browser wherever it can, because "what does a parent
 * meet on their very first visit?" is most of what this file is about.
 */

async function fillProfile(
  page: Page,
  {
    nickname,
    ageBand,
    avatar,
  }: { nickname: string; ageBand?: string; avatar?: string },
) {
  await page.getByLabel("Nickname").fill(nickname);
  if (ageBand) await page.getByRole("radio", { name: ageBand }).check();
  if (avatar) await page.getByRole("radio", { name: avatar }).check();
}

test.describe("a parent's first visit", () => {
  test("is welcomed, told what is collected, and creates a child", async ({
    page,
  }) => {
    await page.goto("/parent");

    await expect(
      page.getByRole("heading", { name: "Welcome to Kindlyo" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Get started" }).click();

    // The privacy position is stated before anything is asked for.
    await expect(page.getByText("An email address")).toBeVisible();
    await expect(page.getByText("A full legal name")).toBeVisible();
    await expect(page.getByText("An exact birthday")).toBeVisible();
    await expect(
      page.getByText(/Prototype — stored on this device only/),
    ).toBeVisible();

    await page.getByRole("button", { name: "Add your first child" }).click();
    await fillProfile(page, {
      nickname: "Ada",
      ageBand: "Ages 7–9",
      avatar: "Fox",
    });
    await page.getByRole("button", { name: "Create profile" }).click();

    await expect(
      page.getByRole("heading", { name: "For parents" }),
    ).toBeVisible();
    await expect(page.getByRole("region", { name: "Ada" })).toBeVisible();
  });

  test("asks for a nickname, and nothing that could identify a child", async ({
    page,
  }) => {
    await page.goto("/parent");
    await page.getByRole("button", { name: "Get started" }).click();
    await page.getByRole("button", { name: "Add your first child" }).click();

    await expect(page.getByRole("textbox")).toHaveCount(1);
    await expect(page.getByLabel("Nickname")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveCount(0);
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    await expect(page.locator('input[type="date"]')).toHaveCount(0);
    await expect(page.locator('input[type="file"]')).toHaveCount(0);
  });

  test("does not show onboarding again on a later visit", async ({ page }) => {
    await page.goto("/parent");
    await page.getByRole("button", { name: "Skip for now" }).click();
    await expect(
      page.getByRole("heading", { name: "For parents" }),
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("heading", { name: "For parents" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Welcome to Kindlyo" }),
    ).toHaveCount(0);
  });
});

test.describe("managing profiles", () => {
  test.beforeEach(async ({ page }) => {
    await seedProfiles(page, ["Ada"]);
    await page.goto("/parent");
  });

  test("edits a child's nickname, age, and picture", async ({ page }) => {
    await page.getByRole("button", { name: "Edit profile: Ada" }).click();

    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Nickname").fill("Adaline");
    await dialog.getByRole("radio", { name: "Ages 7–9" }).check();
    await dialog.getByRole("radio", { name: "Star" }).check();
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByRole("region", { name: "Adaline" })).toBeVisible();
    await expect(page.getByText("Ages 7–9")).toBeVisible();

    // And it survives a reload, because it was written not just rendered.
    await page.reload();
    await expect(page.getByRole("region", { name: "Adaline" })).toBeVisible();
  });

  test("keeps the old details when an edit is cancelled", async ({ page }) => {
    await page.getByRole("button", { name: "Edit profile: Ada" }).click();
    await page.getByRole("dialog").getByLabel("Nickname").fill("Someone else");
    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(page.getByRole("region", { name: "Ada" })).toBeVisible();
  });

  test("adds a second and third child, then explains the limit", async ({
    page,
  }) => {
    for (const nickname of ["Ben", "Cal"]) {
      await page.getByRole("button", { name: "Add a child" }).click();
      await fillProfile(page, { nickname });
      await page.getByRole("button", { name: "Create profile" }).click();
      await expect(page.getByRole("region", { name: nickname })).toBeVisible();
    }

    await expect(page.getByText("Three profiles is the maximum")).toBeVisible();
    await expect(page.getByRole("button", { name: "Add a child" })).toHaveCount(
      0,
    );
  });

  test("deletes a child only after confirming", async ({ page }) => {
    await page.getByRole("button", { name: "Delete profile: Ada" }).click();
    await page.getByRole("button", { name: "Keep profile" }).click();
    await expect(page.getByRole("region", { name: "Ada" })).toBeVisible();

    await page.getByRole("button", { name: "Delete profile: Ada" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Delete profile" })
      .click();

    await expect(page.getByRole("region", { name: "Ada" })).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "No profiles yet" }),
    ).toBeVisible();
  });
});

test.describe("choosing a child and coming back", () => {
  test.beforeEach(async ({ page }) => {
    await seedProfiles(page, ["Ada", "Ben"]);
  });

  test("asks the child who they are, with big targets and few words", async ({
    page,
  }) => {
    await page.goto("/learn");
    await page.getByRole("button", { name: "Switch" }).click();

    await expect(
      page.getByRole("heading", { name: "Who is learning?" }),
    ).toBeVisible();

    // Every choice clears the 44x44 minimum comfortably — this is the screen a
    // five-year-old drives.
    for (const nickname of ["Ada", "Ben"]) {
      const box = await page
        .getByRole("button", { name: nickname, exact: true })
        .boundingBox();
      expect(box?.height ?? 0).toBeGreaterThan(120);
      expect(box?.width ?? 0).toBeGreaterThan(120);
    }
  });

  test("remembers the choice and offers a way back to the grown-ups", async ({
    page,
  }) => {
    await page.goto("/learn");
    await page.getByRole("button", { name: "Switch" }).click();
    await page.getByRole("button", { name: "Ben", exact: true }).click();

    await expect(page.getByText("Learning as")).toContainText("Ben");
    await page.reload();
    await expect(page.getByText("Learning as")).toContainText("Ben");
  });

  test("returns to the parent area from the child shell", async ({ page }) => {
    await page.goto("/learn");

    await page.getByRole("link", { name: "For parents" }).click();

    await expect(page).toHaveURL(/\/parent$/);
    await expect(
      page.getByRole("heading", { name: "For parents" }),
    ).toBeVisible();
  });

  test("returns to the parent area from the picker", async ({ page }) => {
    await page.goto("/learn");
    await page.getByRole("button", { name: "Switch" }).click();

    await page.getByRole("link", { name: "For grown-ups" }).click();

    await expect(page).toHaveURL(/\/parent$/);
    await expect(
      page.getByRole("heading", { name: "For parents" }),
    ).toBeVisible();
  });

  test("shows an edited nickname on the child's own screen", async ({
    page,
  }) => {
    await page.goto("/parent");
    await page.getByRole("button", { name: "Edit profile: Ada" }).click();
    await page.getByRole("dialog").getByLabel("Nickname").fill("Adaline");
    await page.getByRole("button", { name: "Save changes" }).click();

    await page.goto("/learn");

    await expect(page.getByText("Learning as")).toContainText("Adaline");
  });
});
