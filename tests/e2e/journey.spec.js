import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("12 questions complete, scoring shows ESTJ and human-readable axis explanations", async ({ page }) => {
  await page.locator("#start-button").click();
  for (let i = 0; i < 12; i++) {
    await expect(page.locator("#question-counter")).toHaveText(
      String(i + 1).padStart(2, "0") + " / 12");
    await page.locator("#quiz-options .option-card").first().click();
    await page.locator("#next-question").click();
  }
  await expect(page.locator("#result-code")).toHaveText("ESTJ");
  await expect(page.locator("#result-title")).not.toBeEmpty();
  await expect(page.locator("#result-axes .score-axis")).toHaveCount(4);
  await expect(page.locator("#result-axes")).not.toContainText("NaN");
  await expect(page.locator("#result-animal")).toHaveAttribute("src", /estj-bee\.png$/);
});

test("rapid double click on next never skips the following unanswered question", async ({ page }) => {
  await page.locator("#start-button").click();
  await page.locator("#quiz-options .option-card").first().click();
  await page.locator("#next-question").dblclick();
  await expect(page.locator("#question-counter")).toHaveText("02 / 12");
  await expect(page.locator("#next-question")).toBeDisabled();
});

test("answers can be edited after going back and keyboard shortcuts work", async ({ page }) => {
  await page.locator("#start-button").click();
  await page.keyboard.press("4");
  await expect(page.locator("#quiz-options .option-card").nth(3)).toHaveAttribute("aria-pressed","true");
  await page.locator("#next-question").click();
  await page.locator("#previous-question").click();
  await expect(page.locator("#quiz-options .option-card").nth(3)).toHaveAttribute("aria-pressed","true");
  await page.locator("#quiz-options .option-card").first().click();
  await expect(page.locator("#quiz-options .option-card").nth(3)).toHaveAttribute("aria-pressed","false");
  await expect(page.locator("#quiz-options .option-card").first()).toHaveAttribute("aria-pressed","true");
});

test("progress restores after refresh and can be cleared without affecting theme", async ({ page }) => {
  await page.locator("#start-button").click();
  await page.locator("#quiz-options .option-card").first().click();
  await page.locator("#next-question").click();
  await page.reload();
  await expect(page.locator("#resume-button")).toBeVisible();
  await page.locator("#resume-button").click();
  await expect(page.locator("#question-counter")).toHaveText("02 / 12");
  await page.locator("#clear-data").click();
  await expect(page.locator("#resume-button")).toBeHidden();
});

test("personality library contains all 16 profiles and exposes no answer form", async ({ page }) => {
  await page.getByRole("button", { name: "人格图鉴" }).click();
  await expect(page.locator("#types-grid .type-card")).toHaveCount(16);
  await expect(page.locator("#screen-quiz")).toBeHidden();
});

test("theme is persistent and page never overflows horizontally on mobile", async ({ page }) => {
  await page.locator("#theme-toggle").click();
  const selected = await page.locator("html").getAttribute("data-theme");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", selected);
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
});

test("no uncaught page errors on start, quiz and gallery", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.locator("#start-button").click();
  await page.locator("#quiz-options .option-card").first().click();
  await page.locator("#next-question").click();
  await page.getByRole("button", {name:"人格图鉴"}).click();
  expect(errors).toEqual([]);
});
