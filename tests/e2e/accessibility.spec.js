import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async({page})=>{await page.goto("/");await page.evaluate(()=>localStorage.clear());await page.reload()});
const check=async(page,label)=>{
 const results=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
 expect(results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary,data:n.any?.[0]?.data}))})),label).toEqual([]);
};
test("home, questionnaire and gallery have no automatic WCAG A/AA violations",async({page})=>{
 await check(page,"home");
 await page.locator("#start-button").click();
 await check(page,"questionnaire");
 await page.getByRole("button",{name:"人格图鉴"}).click();
 await check(page,"gallery");
});
test("single-choice semantics, native keyboard and correct progress",async({page})=>{
 await page.locator("#start-button").click();
 const choices=page.getByRole("radio");
 await expect(choices).toHaveCount(4);
 await expect(page.locator("#quiz-progress")).toHaveAttribute("aria-valuenow","0");
 await choices.first().focus();
 await page.keyboard.press("Space");
 await expect(choices.first()).toBeChecked();
 await expect(page.locator("#quiz-progress")).toHaveAttribute("aria-valuenow","1");
 await page.keyboard.press("ArrowDown");
 await expect(choices.nth(1)).toBeChecked();
 await page.locator("#next-question").click();
 await expect(page.locator("#quiz-progress")).toHaveAttribute("aria-valuenow","1");
});
test("screen navigation restores a focusable heading",async({page})=>{
 await page.locator("#start-button").click();
 await expect(page.locator("#quiz-heading")).toBeFocused();
 await page.getByRole("button",{name:"人格图鉴"}).click();
 await expect(page.locator("#types-heading")).toBeFocused();
});
