import { test, expect } from "@playwright/test";

test("a logged-in user can delete a recipe and it's gone", async ({ page }) => {
  await page.goto("/");

  // log in through the AuthStatus box (the same flow as add-recipe.spec.ts)
  await page.getByPlaceholder("Email").fill("me@example.com");
  await page.getByPlaceholder("Password").fill("supersecret");
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page.getByText(/signed in as/i)).toBeVisible();

  // add a recipe to delete (unique name, so we only ever touch this run's recipe)
  await page.getByRole("link", { name: "Add" }).click();
  const name = `E2E Delete me ${Date.now()}`;
  await page.getByPlaceholder("Recipe name").fill(name);
  await page.getByRole("button", { name: /add/i }).click();
  await expect(page.getByText(name)).toBeVisible();

  // find the list item with our recipe, and click the Delete button inside it
  const item = page.getByRole("listitem").filter({ hasText: name });
  await item.getByRole("button", { name: "Delete" }).click();

  // the list only refetches after the API confirmed the delete, so the recipe
  // disappearing means it's really gone from the database. not.toBeVisible() waits too.
  await expect(page.getByText(name)).not.toBeVisible();
});
