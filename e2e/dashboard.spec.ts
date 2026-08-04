import { expect, test, type Page } from "@playwright/test";
import { seedProfiles } from "./support/family";

/**
 * The parent dashboard in a production build.
 *
 * Two jobs: prove it answers its five questions with real data, and hold the
 * lines that matter — neutral language, no comparison between siblings, and a
 * layout that survives a phone. The last one can only be checked in a real
 * browser, which is why it lives here and not in the unit suite.
 */

async function completeLessonOne(page: Page) {
  await page.goto("/learn");
  await page.getByRole("link", { name: "Start lesson 1", exact: true }).click();

  const next = page.getByRole("button", { name: "Next" });
  await next.click();
  // The "it depends" option, so a talking point appears on the dashboard.
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

test.describe("what the dashboard answers", () => {
  test.beforeEach(async ({ page }) => {
    await seedProfiles(page, ["Ada"]);
    await completeLessonOne(page);
    await page.goto("/parent");
  });

  test("what has my child practised, and what is next", async ({ page }) => {
    await expect(
      page.getByRole("progressbar", { name: /lessons practised/i }),
    ).toHaveAttribute("aria-valuenow", "1");
    await expect(page.getByText("2. Introducing yourself")).toBeVisible();
    await expect(page.getByText("Greeting people")).toBeVisible();
    await expect(page.getByText("Ready to review")).toBeVisible();
  });

  test("which offline mission is active", async ({ page }) => {
    await expect(page.getByText("Try together")).toBeVisible();
    await expect(page.getByText(/Afterwards:/)).toBeVisible();

    await page.getByRole("button", { name: /^Mark as done/ }).click();
    await expect(page.getByText("Done", { exact: true })).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("button", { name: /Mark as not done yet/ }),
    ).toBeVisible();
  });

  test("where my child wanted more context", async ({ page }) => {
    await expect(page.getByText("Worth talking about")).toBeVisible();
    await expect(page.getByText(/These are not wrong answers/)).toBeVisible();
    await expect(page.getByText(/They chose:/)).toBeVisible();
    await expect(page.getByText(/Try asking:/)).toBeVisible();
  });

  test("when my child last used the app", async ({ page }) => {
    await expect(page.getByText("Last used")).toBeVisible();
    await expect(page.getByText("today", { exact: true })).toBeVisible();
  });

  test("recent lesson activity", async ({ page }) => {
    // Scoped by the region's accessible name: a bare `section` locator would
    // also match the child panel that contains this one.
    const recent = page.getByRole("region", { name: "Recent lessons" });

    await expect(recent.getByText("Saying hello")).toBeVisible();
    await expect(recent.getByText(/Practised ·/)).toBeVisible();
  });

  test("uses no scores, grades, or judgements of the child", async ({
    page,
  }) => {
    const body =
      (await page.locator("body").textContent())?.toLowerCase() ?? "";

    for (const banned of [
      "score",
      "grade",
      "rank",
      "streak",
      "leaderboard",
      "politeness",
      "goodness",
      "well behaved",
      "badly",
      "falling behind",
    ]) {
      expect(body, `dashboard should not say "${banned}"`).not.toContain(
        banned,
      );
    }
    // Nor a percentage, which reads as attainment however it is meant.
    await expect(page.getByText(/\d+\s*%/)).toHaveCount(0);
  });
});

test.describe("the empty state", () => {
  test("says what will appear here, without nagging", async ({ page }) => {
    await seedProfiles(page, ["Ada"]);
    await page.goto("/parent");

    await expect(
      page.getByRole("heading", { name: "Ada has not started a lesson yet" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open the learning area" }),
    ).toBeVisible();

    const body =
      (await page.locator("body").textContent())?.toLowerCase() ?? "";
    expect(body).not.toContain("should");
    expect(body).not.toContain("overdue");
  });
});

test.describe("the child selector", () => {
  test.beforeEach(async ({ page }) => {
    await seedProfiles(page, ["Ada", "Ben"]);
    await completeLessonOne(page); // as Ada, the seeded selection
    await page.goto("/parent");
  });

  test("shows one child at a time and switches between them", async ({
    page,
  }) => {
    await expect(
      page.getByRole("progressbar", { name: /lessons practised/i }),
    ).toHaveAttribute("aria-valuenow", "1");

    await page.getByRole("tab", { name: "Ben" }).click();

    await expect(
      page.getByRole("heading", { name: "Ben has not started a lesson yet" }),
    ).toBeVisible();
    // Ada's numbers are gone, not merely further down the page.
    await expect(
      page.getByRole("progressbar", { name: /lessons practised/i }),
    ).toHaveCount(0);
  });

  test("never puts two children's numbers side by side", async ({ page }) => {
    await expect(
      page.getByRole("progressbar", { name: /lessons practised/i }),
    ).toHaveCount(1);
  });

  test("does not change who the learning area thinks is learning", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: "Ben" }).click();

    // Viewing Ben's dashboard is a parent looking, not a handover.
    await page.goto("/learn");
    await expect(page.getByText("Learning as")).toContainText("Ada");
  });
});

test.describe("accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await seedProfiles(page, ["Ada", "Ben"]);
    await completeLessonOne(page);
    await page.goto("/parent");
  });

  test("has one h1 and a heading outline that never skips a level", async ({
    page,
  }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    const levels = await page
      .locator("h1, h2, h3, h4, h5, h6")
      .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName[1])));

    let previous = levels[0] ?? 1;
    for (const level of levels) {
      expect(level - previous).toBeLessThanOrEqual(1);
      previous = level;
    }
  });

  test("labels the child selector and marks the current tab", async ({
    page,
  }) => {
    const tablist = page.getByRole("tablist", { name: "Choose a child" });

    await expect(tablist).toBeVisible();
    await expect(page.getByRole("tab", { name: "Ada" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("tab", { name: "Ben" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  test("is operable from the keyboard, with visible focus", async ({
    page,
  }) => {
    const benTab = page.getByRole("tab", { name: "Ben" });
    await benTab.focus();
    await expect(benTab).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(benTab).toHaveAttribute("aria-selected", "true");
  });

  test("gives every control an accessible name", async ({ page }) => {
    const unnamed = await page
      .getByRole("button")
      .evaluateAll(
        (nodes) =>
          nodes.filter(
            (node) =>
              (
                node.getAttribute("aria-label") ??
                node.textContent ??
                ""
              ).trim() === "",
          ).length,
      );

    expect(unnamed).toBe(0);
  });

  test("keeps every touch target at least 44 by 44", async ({ page }) => {
    const controls = await page.getByRole("button").all();

    for (const control of controls) {
      const box = await control.boundingBox();
      if (box === null) continue;
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe("responsive layout", () => {
  test.beforeEach(async ({ page }) => {
    await seedProfiles(page, ["Ada", "Ben"]);
    await completeLessonOne(page);
  });

  for (const viewport of [
    { name: "phone", width: 375, height: 720 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1280, height: 900 },
  ]) {
    test(`fits a ${viewport.name} without horizontal scroll`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/parent");
      await expect(
        page.getByRole("progressbar", { name: /lessons practised/i }),
      ).toBeVisible();

      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows).toBe(false);
    });
  }

  test("keeps every panel reachable on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto("/parent");

    for (const heading of [
      "Progress",
      "Skill areas",
      "Recent lessons",
      "Worth talking about",
    ]) {
      await expect(
        page.getByText(heading, { exact: true }).first(),
      ).toBeVisible();
    }
  });
});
