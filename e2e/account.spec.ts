import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";
import { E2E_PARENT_PASSWORD, STORAGE_STATE } from "./support/auth";
import { seedProfiles } from "./support/family";

// The account screen is behind the route gate, so run as a signed-in parent.
test.use({ storageState: STORAGE_STATE });

/**
 * Sign in as a throwaway parent, so the destructive delete test removes only its
 * own account and can never disturb the parent other specs share.
 */
async function signInAsNewParent(page: Page): Promise<void> {
  const email = `account-${randomUUID()}@example.com`;
  const response = await page.request.post("/api/auth/signin", {
    data: { email, password: E2E_PARENT_PASSWORD },
  });
  expect(response.ok()).toBe(true);
}

test.describe("account & privacy", () => {
  test("shows the privacy summary, membership, and data controls", async ({
    page,
  }) => {
    await page.goto("/parent/account");

    await expect(
      page.getByRole("heading", { name: "Account", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Your privacy" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Go to membership" }),
    ).toHaveAttribute("href", "/parent/billing");
    await expect(
      page.getByRole("link", { name: "Download my data" }),
    ).toHaveAttribute("href", "/api/family/export");
  });

  test("exports the account as a JSON download", async ({ page }) => {
    const response = await page.request.get("/api/family/export");

    expect(response.ok()).toBe(true);
    expect(response.headers()["content-disposition"]).toContain("attachment");
    const body = (await response.json()) as {
      account: { email: string };
      family: unknown;
    };
    expect(body.account.email).toBeTruthy();
    expect(body.family).toBeDefined();
  });

  test("deletes the account and signs the parent out", async ({ page }) => {
    await signInAsNewParent(page);
    await seedProfiles(page, ["Temp"]);

    await page.goto("/parent/account");
    await page.getByRole("button", { name: "Delete account" }).click();

    // Confirm in the dialog (scoped, so it is not the trigger button behind it).
    const dialog = page.getByRole("dialog");
    await Promise.all([
      page.waitForURL((url) => url.pathname === "/"),
      dialog.getByRole("button", { name: "Delete account" }).click(),
    ]);

    // The session is gone: the parent area sends us back to sign in.
    await page.goto("/parent");
    await expect(page).toHaveURL(/\/login/);
  });
});
