import { expect, test, type Page } from "@playwright/test";
import { seedProfiles } from "./support/family";

/**
 * Progression and profile separation, in a real production build.
 *
 * The two rules this file exists to defend:
 *
 * - Completing a lesson unlocks the next one, and nothing else does.
 * - One child's progress never appears for another child.
 */

/** Adds a child from the dashboard, once onboarding is behind us. */
async function addProfile(page: Page, nickname: string) {
  await page.getByRole("button", { name: "Add a child" }).click();
  await page.getByLabel("Nickname").fill(nickname);
  await page.getByRole("button", { name: "Create profile" }).click();
  await expect(page.getByRole("heading", { name: nickname })).toBeVisible();
}

/**
 * Puts the named child in the driving seat, from whatever state the page is
 * in: freshly seeded, already on someone else, or showing the picker.
 */
async function chooseProfile(page: Page, nickname: string) {
  await page.goto("/learn");

  const picker = page.getByRole("heading", { name: "Who is learning?" });
  const learningAs = page.getByText("Learning as");
  // Both are behind hydration, so wait for whichever arrives before deciding.
  await expect(picker.or(learningAs).first()).toBeVisible();

  if (await learningAs.isVisible()) {
    if (((await learningAs.textContent()) ?? "").includes(nickname)) return;
    await page.getByRole("button", { name: "Switch" }).click();
  }

  await page.getByRole("button", { name: new RegExp(nickname) }).click();
  await expect(learningAs).toContainText(nickname);
}

/** Walks lesson one from the path to its completion screen. */
async function completeLessonOne(page: Page) {
  await page.getByRole("link", { name: "Start lesson 1", exact: true }).click();

  const next = page.getByRole("button", { name: "Next" });
  await next.click(); // story -> decision
  await page.getByRole("button", { name: /tell her your name/ }).click();
  await next.click(); // decision -> principle
  await next.click(); // principle -> practice
  await page.getByRole("button", { name: "Wave", exact: true }).click();
  await next.click(); // practice -> mission
  await next.click(); // mission -> coaching
  await next.click(); // coaching -> completion

  await expect(
    page.getByRole("heading", { name: /You finished/ }),
  ).toBeVisible();
}

function lessonRow(page: Page, order: number) {
  return page.getByRole("listitem").filter({ hasText: `Lesson ${order}:` });
}

test.describe("the parent sets up profiles", () => {
  test("creates two child profiles through the parent area", async ({
    page,
  }) => {
    await page.goto("/parent");

    // A first visit lands on onboarding, which ends by creating a child.
    await page.getByRole("button", { name: "Get started" }).click();
    await page.getByRole("button", { name: "Add your first child" }).click();
    await page.getByLabel("Nickname").fill("Ada");
    await page.getByRole("button", { name: "Create profile" }).click();
    await expect(page.getByRole("heading", { name: "Ada" })).toBeVisible();

    await addProfile(page, "Ben");

    // Both cards show their own progress, starting at nothing.
    await expect(page.getByRole("region", { name: "Ada" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Ben" })).toBeVisible();

    // And the learning path now offers a choice of who is learning.
    await page.goto("/learn");
    await expect(
      page.getByRole("heading", { name: "Who is learning?" }),
    ).toBeVisible();
  });
});

test.describe("progression", () => {
  test.beforeEach(async ({ page }) => {
    await seedProfiles(page, ["Ada", "Ben"]);
  });

  test("locks every lesson after the first for a new child", async ({
    page,
  }) => {
    await chooseProfile(page, "Ada");

    await expect(
      lessonRow(page, 1).getByRole("link", { name: /Start lesson 1:/ }),
    ).toBeVisible();
    await expect(lessonRow(page, 2)).toContainText("Finish lesson 1 first");
    // A locked lesson offers nothing to press.
    await expect(lessonRow(page, 3).getByRole("link")).toHaveCount(0);
  });

  test("unlocks the next lesson when one is completed", async ({ page }) => {
    await chooseProfile(page, "Ada");
    await completeLessonOne(page);

    await page.getByRole("link", { name: "Back to the lessons" }).click();

    await expect(lessonRow(page, 1)).toContainText("Done");
    await expect(
      lessonRow(page, 2).getByRole("link", { name: /Start lesson 2:/ }),
    ).toBeVisible();
    // Only the next one, not the whole module.
    await expect(lessonRow(page, 3)).toContainText("Finish lesson 2 first");
    await expect(
      page.getByRole("progressbar", { name: "Lessons finished" }),
    ).toHaveAttribute("aria-valuenow", "1");
  });

  test("keeps a locked lesson closed even when the URL is typed directly", async ({
    page,
  }) => {
    await chooseProfile(page, "Ada");

    await page.goto("/learn/lesson/using-names");

    await expect(
      page.getByRole("heading", { name: "Not this one yet" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Next" })).toHaveCount(0);
  });

  test("resumes an unfinished lesson where the child left off", async ({
    page,
  }) => {
    await chooseProfile(page, "Ada");
    await page
      .getByRole("link", { name: "Start lesson 1", exact: true })
      .click();

    await page.getByRole("button", { name: "Next" }).click();
    await page
      .getByRole("button", { name: /Wave, without saying anything/ })
      .click();

    await page.goto("/learn");

    await expect(lessonRow(page, 1)).toContainText("In progress");
    await page
      .getByRole("link", { name: "Continue lesson 1", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: /Wave, without saying anything/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("profile separation", () => {
  test.beforeEach(async ({ page }) => {
    await seedProfiles(page, ["Ada", "Ben"]);
  });

  test("never shows one child's progress to another child", async ({
    page,
  }) => {
    await chooseProfile(page, "Ada");
    await completeLessonOne(page);
    await page.getByRole("link", { name: "Back to the lessons" }).click();
    await expect(lessonRow(page, 1)).toContainText("Done");

    // Switch to Ben: nothing of Ada's follows him.
    await page.getByRole("button", { name: "Switch" }).click();
    await page.getByRole("button", { name: /Ben/ }).click();

    await expect(
      page.getByRole("progressbar", { name: "Lessons finished" }),
    ).toHaveAttribute("aria-valuenow", "0");
    await expect(lessonRow(page, 1)).not.toContainText("Done");
    await expect(lessonRow(page, 2)).toContainText("Finish lesson 1 first");
  });

  test("keeps a locked lesson locked for the child who has not earned it", async ({
    page,
  }) => {
    await chooseProfile(page, "Ada");
    await completeLessonOne(page);

    // Lesson two is open for Ada...
    await page.goto("/learn/lesson/introducing-yourself");
    await expect(
      page.getByRole("heading", { level: 1, name: "Introducing yourself" }),
    ).toBeVisible();

    // ...and still shut for Ben.
    await page.goto("/learn");
    await page.getByRole("button", { name: "Switch" }).click();
    await page.getByRole("button", { name: /Ben/ }).click();
    await page.goto("/learn/lesson/introducing-yourself");

    await expect(
      page.getByRole("heading", { name: "Not this one yet" }),
    ).toBeVisible();
  });
});

test.describe("the parent dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await seedProfiles(page, ["Ada", "Ben"]);
  });

  test("shows the finished lesson and its mission, per child", async ({
    page,
  }) => {
    await chooseProfile(page, "Ada");
    await completeLessonOne(page);

    await page.goto("/parent");

    const ada = page.getByRole("region", { name: "Ada" });
    await expect(
      ada.getByRole("progressbar", { name: /lessons finished/i }),
    ).toHaveAttribute("aria-valuenow", "1");
    await expect(
      ada.getByRole("heading", { name: "Saying hello" }),
    ).toBeVisible();

    const ben = page.getByRole("region", { name: "Ben" });
    await expect(
      ben.getByRole("progressbar", { name: /lessons finished/i }),
    ).toHaveAttribute("aria-valuenow", "0");
    await expect(
      ben.getByRole("heading", { name: "No missions yet" }),
    ).toBeVisible();
  });

  test("marks an offline mission as done", async ({ page }) => {
    await chooseProfile(page, "Ada");
    await completeLessonOne(page);
    await page.goto("/parent");

    const ada = page.getByRole("region", { name: "Ada" });
    await ada.getByRole("button", { name: /^Mark as done/ }).click();

    await expect(ada.getByText("Done")).toBeVisible();
    await page.reload();
    await expect(
      ada.getByRole("button", { name: /Mark as not done yet/ }),
    ).toBeVisible();
  });

  test("resets one child's progress and leaves the other alone", async ({
    page,
  }) => {
    await chooseProfile(page, "Ada");
    await completeLessonOne(page);
    await page.goto("/learn");
    await page.getByRole("button", { name: "Switch" }).click();
    await page.getByRole("button", { name: /Ben/ }).click();
    await completeLessonOne(page);

    await page.goto("/parent");
    await page.getByRole("button", { name: "Reset progress for Ada" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Reset progress" })
      .click();

    // Ada is back at the start; Ben is untouched.
    await expect(
      page
        .getByRole("region", { name: "Ada" })
        .getByRole("progressbar", { name: /lessons finished/i }),
    ).toHaveAttribute("aria-valuenow", "0");
    await expect(
      page
        .getByRole("region", { name: "Ben" })
        .getByRole("progressbar", { name: /lessons finished/i }),
    ).toHaveAttribute("aria-valuenow", "1");

    // And the path agrees: lesson two is locked for Ada again.
    await page.goto("/learn");
    await page.getByRole("button", { name: "Switch" }).click();
    await page.getByRole("button", { name: /Ada/ }).click();
    await expect(lessonRow(page, 2)).toContainText("Finish lesson 1 first");
  });

  test("deletes a profile behind a confirmation", async ({ page }) => {
    await page.goto("/parent");

    await page.getByRole("button", { name: "Delete profile: Ben" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Delete profile" })
      .click();

    await expect(page.getByRole("region", { name: "Ben" })).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Ada" })).toBeVisible();
  });
});
