import { test, expect } from "@playwright/test";

const storageKey = "personaquest:progress:2.1.0";
async function answerAll(page) {
  await page.locator("#start-button").click();
  for (let i = 0; i < 12; i++) {
    await page.locator("#quiz-options .option-card").first().click();
    await page.locator("#next-question").click();
  }
}
test("broken AVIF/WebP requests fall back to the one allowed PNG without looping", async ({page}) => {
  const errors = [];
  page.on("pageerror", err => errors.push(err.message));
  await page.route("**/assets/optimized/**", route => route.abort());
  await page.goto("/");
  await answerAll(page);
  await expect(page.locator("#result-code")).toHaveText("ESTJ");
  await expect(page.locator("#result-picture source")).toHaveCount(0);
  await expect(page.locator("#result-animal")).toHaveAttribute("src", "./assets/images/all-animals_resized.png");
  const loaded=await page.locator("#result-animal").evaluate(async image => {
    await image.decode();
    return {width:image.naturalWidth,src:image.currentSrc};
  });
  expect(loaded.width).toBeGreaterThan(0);
  expect(loaded.src).toContain("all-animals_resized.png");
  expect(errors).toEqual([]);
});

test("corrupted persisted values are safely discarded; compatible selections survive", async ({page}) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify({
      version:"2.1.0", index:200, finished:true,
      answers:{q01:"q01-a",q02:"missing",bogus:"evil"}
    }));
  },storageKey);
  await page.goto("/");
  await expect(page.locator("#resume-button")).toBeVisible();
  await expect(page.locator("#resume-count")).toHaveText("1 / 12");
  await page.locator("#resume-button").click();
  await expect(page.locator("#question-counter")).toHaveText("12 / 12");
  await expect(page.locator("#next-question")).toBeDisabled();
  await page.locator("#previous-question").click();
  await expect(page.locator("#question-counter")).toHaveText("11 / 12");
});

test("site works at GitHub Pages project subpath /MBTI/ without root asset URLs", async ({page}) => {
  const errors=[];
  const badResponses=[];
  page.on("pageerror",error=>errors.push(error.message));
  page.on("response",response=>{if(response.status()>=400)badResponses.push(response.url());});
  await page.route("**/MBTI/**",async route=>{
    const original=new URL(route.request().url());
    const path=original.pathname.replace(/^\/MBTI(?=\/|$)/,"")||"/";
    const response=await route.fetch({url:"http://127.0.0.1:4173"+path+original.search});
    await route.fulfill({response});
  });
  await page.goto("/MBTI/");
  await answerAll(page);
  const current=await page.locator("#result-animal").evaluate(async image=>{
    await image.decode();return image.currentSrc;
  });
  expect(new URL(current).pathname).toMatch(/^\/MBTI\/assets\/optimized\//);
  expect(errors).toEqual([]);
  expect(badResponses).toEqual([]);
});

test("reduced-motion and high-contrast presentation preserve keyboard selection", async ({page})=>{
  await page.emulateMedia({reducedMotion:"reduce",forcedColors:"active",colorScheme:"dark"});
  await page.setViewportSize({width:320,height:700});
  await page.goto("/");
  await page.locator("#start-button").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#quiz-heading")).toBeFocused();
  await page.getByRole("radio").first().focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("radio").first()).toBeChecked();
  await expect(page.locator("#quiz-progress")).toHaveAttribute("aria-valuenow","1");
  await page.locator("#next-question").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#quiz-heading")).toBeFocused();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(321);
});
