# Lesson 12 homework — solutions

This folder is the finished code of Lesson 12 plus the homework, and it runs the same way as `L12` (see the run instructions in `L12/README.md`: `docker compose up` in `backend/`, then `bun install && bun run dev` in `frontend/`; the tests run with `bun run test` in `frontend/`).

## Task: a `RecipeList` test with two recipes

Write one test for `RecipeList` that renders two recipes and checks both names show, using `renderWithRouter` and `await screen.findByText(...)`.

**Solution:** the test goes in `frontend/src/components/RecipeList.test.tsx`, under the existing empty-list test, and the file now also imports `renderWithRouter` from `../test-utils`:

```tsx
import { renderWithRouter } from "../test-utils";
// ...
test("shows every recipe it is given", async () => {
  // each item's name is a <Link>, so this one needs the router
  renderWithRouter(
    <RecipeList
      recipes={[
        { id: 1, name: "Pancakes", tag: "breakfast", servings: 4 },
        { id: 2, name: "Tomato soup", tag: null, servings: null },
      ]}
      onDelete={() => {}}
    />,
  );
  // the router renders on the next tick, so wait for the first name to appear
  expect(await screen.findByText(/Pancakes/)).toBeInTheDocument();
  expect(screen.getByText(/Tomato soup/)).toBeInTheDocument();
});
```

Why it looks like this:

- Every `RecipeItem` renders its name inside a TanStack `<Link>`, which only works inside a router. The empty-list test gets away with plain `render` because it renders no items; this one does not.
- The router draws on the next tick, so the first check uses `findByText`, which waits. Once the first name is there the whole list is there, so the second check can use `getByText`.
- The names are matched with regular expressions (`/Pancakes/`), like in `RecipeItem.test.tsx`, because the tag is drawn inside the same link (`Pancakes — breakfast`), so the link's text is more than just the name.
- The two recipes have different shapes (one with tag and servings, one with `null`s), which matches what the API really returns and must satisfy the `Recipe` type.

**Verify:** in `frontend/`:

```bash
bun run test
```

Expected: 3 test files and `5 passed` (the 4 from the lesson plus this one), with `RecipeList.test.tsx (2 tests)`. Above it you will see `Error: Not implemented: window.scrollTo` and a stack trace, the same jsdom gap the lesson explains for `RecipeItem.test.tsx`. It is not a failure.

## Task: make the test fail

Confirm the test fails if `RecipeList` renders only the first recipe.

**Solution:** nothing is kept; this is a check. Exact steps, with `bun run test` running in watch mode:

1. In `frontend/src/components/RecipeList.tsx`, change `{recipes.map((recipe) => (` to `{recipes.slice(0, 1).map((recipe) => (` and save.
2. The tests rerun. Expected: `× shows every recipe it is given`, with `Unable to find an element with the text: /Tomato soup/`, and the summary `1 failed | 4 passed (5)`. "Pancakes" was still found, because the first recipe is still drawn.
3. Change it back to `{recipes.map((recipe) => (` and save. Expected: `5 passed` again.

This proves the test checks what it claims. A test that stays green when the code is broken would not protect you.

## Task: user-visible queries and jsdom

Be ready to say why we find things by what the user sees instead of the component's internals, and what jsdom does.

**Model answer:** A user only sees text, labels and buttons, so a test that finds things the same way checks the behaviour the user relies on, and keeps passing when you refactor the inside of a component (rename state, split it up, change the markup) without changing what is on screen; a test tied to internals breaks on every refactor and can pass while the screen is wrong. jsdom is a fake browser that runs inside Node: it builds the page (`document`, elements, clicks, typing) in memory without drawing it, so `render(...)` has somewhere to put the HTML when tests run in a terminal. It is fast but not a real browser, which is why some things, like `window.scrollTo`, are missing.

## Files changed compared with L12

- `frontend/src/components/RecipeList.test.tsx`: imports `renderWithRouter` and adds the "shows every recipe it is given" test.
- `README.md`: this file.
