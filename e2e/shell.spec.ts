import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { E2E_PARENT_PASSWORD, STORAGE_STATE } from "./support/auth";

// This spec follows the footer links into the gated product surfaces, so it
// runs as a signed-in parent. The unauthenticated gate itself is auth.spec.ts.
test.use({ storageState: STORAGE_STATE });

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

  test("navigates to the product surfaces from the footer", async ({
    page,
  }) => {
    // Both app surfaces are reached from the footer rather than the header:
    // the header nav belongs to the marketing pages, and these two are
    // labelled "preview" because they run on prototype local storage.
    //
    // This test asserts the pristine first-visit states (no child profile yet,
    // onboarding not done). The default signed-in parent is shared across specs
    // and its profiles/onboarding live in the server's store, which sibling
    // specs mutate — and onboarding, once completed, is never undone. So sign in
    // as a brand-new parent nobody else uses (the offline gateway sessions any
    // well-formed credentials; the id derives from the email), making the empty
    // states deterministic under parallel and serial runs alike.
    const isolatedParent = `shell-footer-${randomUUID()}@example.com`;
    const signIn = await page.request.post("/api/auth/signin", {
      data: { email: isolatedParent, password: E2E_PARENT_PASSWORD },
    });
    expect(signIn.ok()).toBe(true);

    await page.goto("/");

    // Scoped to the footer: the homepage's "Jump into the product" band also
    // links to the same surfaces, so an unscoped name would match twice.
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Learning app" })
      .click();
    // Wait for the route to change before asserting on a heading: the homepage
    // now carries "Learn" as a substring in several headings ("Little Learner's
    // Club", the "Learning app" card), so checking mid-navigation would race.
    await expect(page).toHaveURL(/\/learn(\/|$)/);
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
    await page.goto("/");
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Parent dashboard" })
      .click();
    await expect(page).toHaveURL(/\/parent(\/|$)/);
    await expect(
      page.getByRole("heading", {
        name: "Welcome to Little Learner's Club",
        level: 1,
      }),
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
