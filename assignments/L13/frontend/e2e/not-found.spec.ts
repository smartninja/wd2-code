import { test, expect } from "@playwright/test";

test("a recipe that doesn't exist shows Not found.", async ({ page }) => {
  // no login needed: reading a recipe is public
  await page.goto("/recipes/999");

  // the 404 is an answer (getRecipe returns null), so this shows straight away
  await expect(page.getByText("Not found.")).toBeVisible();
});
