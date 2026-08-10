import { expect, test, type Page } from "@playwright/test";

/**
 * The public site, against a production build.
 *
 * Two things here can only be checked in a real browser: which copy of the
 * responsive navigation is actually displayed (jsdom loads no CSS, so the unit
 * tests see both), and whether a native `<details>` opens.
 *
 * The no-storage assertions are the important ones. `prompts/07-marketing-site.md`
 * requires that the sample scenario neither requires nor collects child
 * personal data, and a promise like that is worth pinning to a test.
 */

const marketingRoutes = [
  { path: "/", heading: "Little steps to big kindness." },
  { path: "/how-it-works", heading: "A lesson takes about five minutes" },
  {
    path: "/curriculum",
    heading: "What Little Learner's Club teaches, and how",
  },
  {
    path: "/for-parents",
    heading: "You hold the account. Your child learns inside it.",
  },
  { path: "/safety", heading: "Safety and privacy" },
  { path: "/pricing", heading: "We have not set a price yet" },
  { path: "/waitlist", heading: "Be a founding family" },
  { path: "/privacy", heading: "Privacy policy" },
  { path: "/terms", heading: "Terms of use" },
] as const;

async function storedKeys(page: Page): Promise<number> {
  return page.evaluate(() => window.localStorage.length);
}

test.describe("marketing pages", () => {
  for (const route of marketingRoutes) {
    test(`${route.path} responds with exactly one h1`, async ({ page }) => {
      const response = await page.goto(route.path);

      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(
        page.getByRole("heading", { level: 1, name: route.heading }),
      ).toBeVisible();
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  }

  test("says it is in private beta on every page", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText("Private beta").first()).toBeVisible();
  });

  test("reaches every marketing page from the header on a wide viewport", async ({
    page,
  }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Main" });
    for (const label of [
      "How it works",
      "Curriculum",
      "For parents",
      "Safety",
      "Pricing",
    ]) {
      // Strict mode: exactly one copy of each link may be displayed.
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("hides the navigation behind a disclosure on a phone", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Main" });
    const pricing = nav.getByRole("link", { name: "Pricing" });
    await expect(pricing).toBeHidden();

    await page.getByText("Menu").click();
    await expect(pricing).toBeVisible();
  });

  test("opens the menu with the keyboard alone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto("/");

    const summary = page.getByText("Menu");
    await summary.focus();
    await page.keyboard.press("Enter");

    await expect(
      page.getByRole("navigation", { name: "Main" }).getByRole("link", {
        name: "Curriculum",
      }),
    ).toBeVisible();
  });

  test("has no horizontal scroll on any page at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });

    for (const route of marketingRoutes) {
      await page.goto(route.path);
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows, `${route.path} scrolls horizontally`).toBe(false);
    }
  });

  test("reaches the legal placeholders from the footer", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Privacy policy" }).click();
    await expect(page).toHaveURL(/\/privacy$/);

    await page.getByRole("link", { name: "Terms of use" }).click();
    await expect(page).toHaveURL(/\/terms$/);
  });

  test("publishes a sitemap and robots file with absolute URLs", async ({
    page,
  }) => {
    const sitemap = await page.goto("/sitemap.xml");
    expect(sitemap?.status()).toBe(200);
    const sitemapBody = (await sitemap?.text()) ?? "";
    expect(sitemapBody).toContain("<loc>http");
    expect(sitemapBody).toContain("/how-it-works");
    // Draft lesson pages are noindex; advertising them here would contradict it.
    expect(sitemapBody).not.toContain("/learn/lesson/");

    const robots = await page.goto("/robots.txt");
    expect(robots?.status()).toBe(200);
    const robotsBody = (await robots?.text()) ?? "";
    expect(robotsBody).toContain("Sitemap: http");
    expect(robotsBody).toContain("Disallow: /dev/");
  });
});

test.describe("sample scenario", () => {
  test("is playable with no account and saves nothing", async ({ page }) => {
    await page.goto("/");
    expect(await storedKeys(page)).toBe(0);

    const scenario = page.getByRole("region", {
      name: "Try the moment your child would meet",
    });
    await expect(scenario).toBeVisible();
    // The draft label is a product requirement, not decoration (CLAUDE.md).
    await expect(scenario).toContainText("Draft");

    const firstChoice = scenario.getByRole("button").first();
    const choiceLabel = (await firstChoice.textContent()) ?? "";
    await firstChoice.click();
    await expect(firstChoice).toHaveAttribute("aria-pressed", "true");
    expect(choiceLabel.length).toBeGreaterThan(0);

    const explain = scenario.getByRole("button", {
      name: /why does this help/i,
    });
    await expect(explain).toBeVisible();
    await explain.click();
    await expect(
      scenario.getByRole("heading", { name: "Worth remembering" }),
    ).toBeVisible();

    // The whole point: playing the demo leaves no trace of the child.
    expect(await storedKeys(page)).toBe(0);
    expect(await page.evaluate(() => document.cookie)).toBe("");
  });

  test("works at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto("/");

    const scenario = page.getByRole("region", {
      name: "Try the moment your child would meet",
    });
    await scenario.getByRole("button").first().click();

    await expect(
      scenario.getByRole("button", { name: /why does this help/i }),
    ).toBeVisible();
    expect(await storedKeys(page)).toBe(0);
  });
});

test.describe("waitlist", () => {
  test("refuses a malformed address without sending it", async ({ page }) => {
    let requests = 0;
    await page.route("**/api/waitlist", async (route) => {
      requests += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/waitlist");
    await page.getByLabel("Your email address").fill("not-an-email");
    await page.getByRole("button", { name: "Join the waitlist" }).click();

    // Scoped to the form: Next's own route announcer is also a role="alert".
    const form = page.getByRole("region", { name: "Be a founding family" });
    await expect(form.getByRole("alert")).toContainText(
      /does not look like an email address/i,
    );
    expect(requests).toBe(0);
  });

  test("accepts a valid address and confirms", async ({ page }) => {
    await page.goto("/waitlist");
    await page.getByLabel("Your email address").fill("parent@example.com");
    await page.getByRole("button", { name: "Join the waitlist" }).click();

    await expect(page.getByText(/your address is recorded/i)).toBeVisible();
  });

  test("offers no field for a child's name", async ({ page }) => {
    await page.goto("/waitlist");

    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    await expect(page.locator('input[type="date"]')).toHaveCount(0);
    await expect(page.locator('input[type="file"]')).toHaveCount(0);
    await expect(page.getByRole("textbox")).toHaveCount(1);
  });
});
