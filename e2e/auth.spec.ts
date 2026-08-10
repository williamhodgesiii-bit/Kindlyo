import { expect, test, type Page } from "@playwright/test";
import { E2E_PARENT_EMAIL, E2E_PARENT_PASSWORD } from "./support/auth";

/**
 * The route gate and the sign-in / sign-out flow, in a production build.
 *
 * These run signed out on purpose (empty storage state), unlike the parent and
 * learning specs which reuse a saved session. Together with those, this covers
 * the authorization requirement in docs/TESTING_STRATEGY.md: unauthenticated
 * users cannot reach protected routes.
 */

test.use({ storageState: { cookies: [], origins: [] } });

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(E2E_PARENT_EMAIL);
  await page.getByLabel("Password").fill(E2E_PARENT_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/parent");
}

test.describe("the route gate", () => {
  test("sends a signed-out visitor from /parent to sign in", async ({
    page,
  }) => {
    await page.goto("/parent");

    await expect(page).toHaveURL(/\/login\?redirectTo=%2Fparent/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Sign in" }),
    ).toBeVisible();
  });

  test("sends a signed-out visitor from /learn to sign in", async ({
    page,
  }) => {
    await page.goto("/learn");

    await expect(page).toHaveURL(/\/login\?redirectTo=%2Flearn/);
  });

  test("keeps a child lesson URL behind the gate too", async ({ page }) => {
    await page.goto("/learn/lesson/saying-hello");

    await expect(page).toHaveURL(/\/login\?redirectTo=/);
  });
});

test.describe("signing in and out", () => {
  test("signs in and reaches the parent area", async ({ page }) => {
    await signIn(page);
    await expect(page.getByText(E2E_PARENT_EMAIL)).toBeVisible();
  });

  test("signs out to the homepage, then the gate returns", async ({ page }) => {
    await signIn(page);

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Little steps to big kindness.",
      }),
    ).toBeVisible();

    // The session is really gone: /parent gates again.
    await page.goto("/parent");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("password reset", () => {
  test("gives the same neutral confirmation for any address", async ({
    page,
  }) => {
    await page.goto("/forgot-password");
    await page.getByLabel("Email address").fill("someone@example.com");
    await page.getByRole("button", { name: "Send reset link" }).click();

    await expect(
      page.getByText(/if that email address has an account/i),
    ).toBeVisible();
  });
});
