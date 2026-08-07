import { expect, type Page } from "@playwright/test";

/**
 * Solve the "Ask a grown-up" gate that guards every exit from the child area.
 *
 * The gate poses a small sum with the numbers spelled out (e.g. "seven plus
 * five") and changes on every open, so a spec cannot hard-code the answer: it
 * reads the question, works out the total, and continues.
 */

const NUMBER_WORDS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
};

export async function solveParentalGate(page: Page): Promise<void> {
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Ask a grown-up" }),
  ).toBeVisible();

  const question = (await dialog.locator("label").textContent()) ?? "";
  const match = question.match(/what is (\w+) plus (\w+)/i);
  if (match === null) {
    throw new Error(`Unexpected parental-gate question: "${question}"`);
  }

  const a = NUMBER_WORDS[match[1].toLowerCase()];
  const b = NUMBER_WORDS[match[2].toLowerCase()];
  if (a === undefined || b === undefined) {
    throw new Error(
      `Unknown number word in parental-gate question: "${question}"`,
    );
  }

  await dialog.getByRole("textbox").fill(String(a + b));
  await dialog.getByRole("button", { name: "Continue" }).click();
}
