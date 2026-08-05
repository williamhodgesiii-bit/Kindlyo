import { expect, test as setup } from "@playwright/test";
import {
  E2E_PARENT_EMAIL,
  E2E_PARENT_PASSWORD,
  STORAGE_STATE,
} from "./support/auth";

/**
 * Sign in once, then save the session for the specs behind the route gate.
 *
 * This drives the real sign-in form (so the flow is genuinely exercised) against
 * the offline development stand-in the e2e build runs with. Every spec that
 * reaches `/parent` or `/learn` reuses the saved state rather than logging in
 * again.
 */
setup("authenticate as a parent", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email address").fill(E2E_PARENT_EMAIL);
  await page.getByLabel("Password").fill(E2E_PARENT_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();

  // Landing on /parent with the account bar showing the email proves the
  // session cookie was set and the gate let us through.
  await page.waitForURL("**/parent");
  await expect(page.getByText(E2E_PARENT_EMAIL)).toBeVisible();

  await page.context().storageState({ path: STORAGE_STATE });
});
