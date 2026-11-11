# Lesson 13 homework — solutions

This is the finished code of lesson 13 plus the homework, and it runs exactly like `L13` (see the run instructions in `L13/README.md`: the backend in Docker with `flask create-admin`, the frontend with `bun run dev`, then `bun run e2e`).

## Task: a delete E2E test

Asked: a second E2E test that logs in, adds a recipe, deletes it and checks it's gone.

**Solution:** a new file, `frontend/e2e/delete-recipe.spec.ts`. It logs in with the same steps as `add-recipe.spec.ts`, adds a recipe with a unique name (`Date.now()`), then clicks the Delete button that belongs to *that* recipe:

```ts
const item = page.getByRole("listitem").filter({ hasText: name });
await item.getByRole("button", { name: "Delete" }).click();

await expect(page.getByText(name)).not.toBeVisible();
```

- Every recipe row has a Delete button, so `page.getByRole("button", { name: "Delete" })` alone would match several and fail with a strict mode violation. `filter({ hasText: name })` first narrows the list items down to the one with our recipe, and the button is looked up inside it.
- `not.toBeVisible()` waits too, just like `toBeVisible()`: Playwright keeps checking until the text is gone (up to 5 seconds).
- The list has no optimistic update: it refetches only after the API answered the delete. So when the name disappears, the recipe is really gone from the database.

**Verify:** with both servers running, from `frontend/` run `bun run e2e`. Expected: `3 passed`. Run `bun run e2e --headed` to watch it add an `E2E Delete me …` recipe and remove it again. Afterwards, the list in the browser has no `E2E Delete me …` rows.

## Task: a "Not found." test

Asked: a test that opens `/recipes/999` and checks that "Not found." is visible.

**Solution:** a new file, `frontend/e2e/not-found.spec.ts`:

```ts
await page.goto("/recipes/999");
await expect(page.getByText("Not found.")).toBeVisible();
```

No login is needed, because reading a recipe is public. This test also guards the lesson's `getRecipe` fix: before it, a `404` was retried three times (about 7 seconds of "Loading…"), which is longer than the 5 seconds `toBeVisible()` waits, so the old code would fail this test.

**Verify:** `bun run e2e` shows `✓ … a recipe that doesn't exist shows Not found.` It assumes your dev database has no recipe with id 999. If it does, pick a bigger id.

To check that all three tests are found without running them: `bunx playwright test --list`. Expected:

```
add-recipe.spec.ts:3:1 › a logged-in user can add a recipe and see it
delete-recipe.spec.ts:3:1 › a logged-in user can delete a recipe and it's gone
not-found.spec.ts:3:1 › a recipe that doesn't exist shows Not found.
Total: 3 tests in 3 files
```

## Task: a failing test leaves a trace, a passing one leaves nothing

Asked: confirm both halves of the `*-on-failure` settings.

**Solution:** no code change; `playwright.config.ts` already has `trace: "retain-on-failure"`, `screenshot: "only-on-failure"` and `video: "retain-on-failure"`. Steps:

1. With both servers running, run `bun run e2e` from `frontend/`. All 3 pass. `ls test-results` shows no test folders (Playwright clears the folder at the start of every run and keeps nothing for a passing test; at most a `.last-run.json` file is there).
2. Break it: `docker compose stop api` in `backend/`. Run `bun run e2e` again. All three fail: the two that log in stop at `signed in as`, and the "Not found." one sits on "Loading…" while the query retries, so "Not found." never appears.
3. `ls test-results`. Each failed test has its own folder with `trace.zip`, `video.webm` and `test-failed-1.png`.
4. `bunx playwright show-report`, click a failed test, then click the trace. In the Trace Viewer, the failing `expect` step is marked, the snapshot shows "Login failed", and the Network tab shows the failed calls to the API.
5. `docker compose start api`, rerun `bun run e2e`: green again, and the failure folders are gone.

## Task: why only a few E2E tests

**Model answer:** E2E tests are slow, because each one drives a real browser through the whole stack, so hundreds of them would take many minutes on every run. When one fails it only tells you *that* a flow broke, not which line, while the backend and component tests point straight at the broken endpoint or component. So you keep many fast tests at the bottom of the pyramid and a few E2E tests for the flows that matter most, like logging in and adding a recipe.

## Files changed compared with L13

- `frontend/e2e/delete-recipe.spec.ts` (new)
- `frontend/e2e/not-found.spec.ts` (new)
- `README.md` (this file, replacing the lesson README)
