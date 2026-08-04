import { expect, test } from "@playwright/test";

test.describe("application shell", () => {
  test("renders the marketing page with one h1 and shared landmarks", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("navigates to the placeholder routes", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Learn", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Learn" })).toBeVisible();
    // With no child profile on this device, the learning area asks a grown-up
    // to set one up rather than showing the module. Progression itself is
    // covered in progress.spec.ts.
    await expect(
      page.getByRole("heading", {
        name: "First, a grown-up sets up a profile",
      }),
    ).toBeVisible();

    // A browser with no profiles is a parent's first visit, so the parent area
    // opens on onboarding. The flow itself is covered in profiles.spec.ts.
    await page.getByRole("link", { name: "For parents" }).click();
    await expect(
      page.getByRole("heading", { name: "Welcome to Kindlyo", level: 1 }),
    ).toBeVisible();
  });

  test("skip link moves focus to the main content", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
  });

  test("shows the custom not-found page for an unknown route", async ({
    page,
  }) => {
    const response = await page.goto("/this-route-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "We could not find that page" }),
    ).toBeVisible();
  });

  test("does not expose the component gallery outside development", async ({
    page,
  }) => {
    // These specs run against `next build && next start`, so this is a real
    // production build - exactly the case the gallery's gate exists for.
    const response = await page.goto("/dev/gallery");

    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Component gallery" }),
    ).toBeHidden();
  });

  test("is usable at a small viewport without horizontal scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto("/");

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows).toBe(false);
  });
});
