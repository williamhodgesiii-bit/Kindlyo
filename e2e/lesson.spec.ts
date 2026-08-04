import { expect, test, type Page } from "@playwright/test";

/**
 * Lesson one, start to finish, in a real production build.
 *
 * Content strings are matched loosely on purpose: this spec is here to prove
 * the engine runs end to end, and rewording a sentence in the curriculum
 * should not break it.
 */

const lessonPath = "/learn/lesson/saying-hello";

async function next(page: Page) {
  await page.getByRole("button", { name: "Next" }).click();
}

test.describe("lesson one", () => {
  test("can be started from the learning path", async ({ page }) => {
    await page.goto("/learn");

    await page.getByRole("link", { name: /Start lesson 1/ }).click();

    await expect(page).toHaveURL(new RegExp(`${lessonPath}$`));
    await expect(
      page.getByRole("heading", { level: 1, name: "Saying hello" }),
    ).toBeVisible();
  });

  test("shows that the content is still a draft", async ({ page }) => {
    await page.goto(lessonPath);

    // The badge reads "Draft" visibly, with the longer explanation for screen
    // readers in the same element.
    await expect(page.getByText(/^Draft\b/).first()).toBeVisible();
  });

  test("runs from the first scene to the completion screen", async ({
    page,
  }) => {
    await page.goto(lessonPath);

    // Story scene.
    await expect(
      page.getByRole("heading", { name: "The first morning at art club" }),
    ).toBeVisible();
    await next(page);

    // Decision: cannot move on until a choice is made.
    await expect(page.getByRole("button", { name: "Next" })).toBeDisabled();
    await page.getByRole("button", { name: /tell her your name/ }).click();
    await expect(page.getByText(/Now Maya knows two things/)).toBeVisible();
    await next(page);

    // Principle.
    await expect(
      page.getByRole("heading", { name: /A hello tells someone/ }),
    ).toBeVisible();
    await next(page);

    // Rehearsal: again gated on an answer.
    await expect(page.getByRole("button", { name: "Next" })).toBeDisabled();
    await page.getByRole("button", { name: "Wave", exact: true }).click();
    await next(page);

    // Offline mission.
    await expect(page.getByText(/say hello to one person/)).toBeVisible();
    await next(page);

    // Parent coaching.
    await expect(page.getByText("For grown-ups")).toBeVisible();
    await next(page);

    // Completion.
    await expect(
      page.getByRole("heading", { name: /You finished/ }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Next" })).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Back to the lessons" }),
    ).toBeVisible();
  });

  test("keeps its place across a reload", async ({ page }) => {
    await page.goto(lessonPath);

    await next(page);
    await page
      .getByRole("button", { name: /Wave, without saying anything/ })
      .click();

    await page.reload();

    await expect(
      page.getByRole("button", { name: /Wave, without saying anything/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("is fully operable with the keyboard", async ({ page }) => {
    await page.goto(lessonPath);
    await expect(page.getByRole("button", { name: "Next" })).toBeEnabled();

    // Tab to the Next button and press it, rather than clicking anything.
    const nextButton = page.getByRole("button", { name: "Next" });
    await nextButton.focus();
    await page.keyboard.press("Enter");

    const firstChoice = page
      .getByRole("button", { name: /tell her your name/ })
      .first();
    await firstChoice.focus();
    await page.keyboard.press("Enter");

    await expect(firstChoice).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  test("404s for a lesson that does not exist", async ({ page }) => {
    const response = await page.goto("/learn/lesson/not-a-lesson");

    expect(response?.status()).toBe(404);
  });

  test("fits a small viewport without horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto(lessonPath);
    await expect(
      page.getByRole("heading", { level: 1, name: "Saying hello" }),
    ).toBeVisible();

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows).toBe(false);
  });
});
