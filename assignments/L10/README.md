# Lesson 10 homework — solutions

This folder is the finished code of Lesson 10 plus the homework, and it runs the same way as `L10` (see the run instructions in `L10/README.md`: `docker compose up` in `backend/`, then `bun install && bun run dev` in `frontend/`).

## Task: "Back to list" link

Add a "back to list" `<Link>` on the detail page.

**Solution:** one file changed, `frontend/src/pages/RecipeDetailPage.tsx`. `Link` is imported next to `useParams`, and a link to `/` sits under the recipe's details:

```tsx
import { Link, useParams } from "@tanstack/react-router";
// ...
      {/* a router <Link>, not <a href="/">: going back swaps the page, no reload */}
      <Link to="/" className="text-blue-600 mt-4 inline-block">
        Back to list
      </Link>
```

It is the router's `<Link>`, the same one the nav bar uses, so the click is handled in the browser. A plain `<a href="/">` would also take you to the list, but with a full page reload. `inline-block` lets the top margin apply to the link, which is an inline element.

The link is only shown when the recipe loaded. On "Loading…" and "Not found." the nav bar's **Recipes** link still takes you back.

**Verify:**

1. Start the backend and frontend, open `http://localhost:5173`.
2. Click a recipe name. The detail page shows the name, tag and servings, and a blue **Back to list** link under them.
3. Click **Back to list**. You are on `/` with the list showing.
4. Type a few letters into the Email box of the login form, open a recipe, click **Back to list**. The letters are still there, so the page did not reload.
5. In `RecipeDetailPage.tsx`, change `to="/"` to `to="/lst"`. The editor underlines it in red (the registered router knows there is no such route). Put it back.

## Task: no full reload while navigating

Check that navigating around never triggers a full reload (watch the Network tab).

**Solution:** nothing to change; this is a check. Exact steps:

1. Open the app at `http://localhost:5173` and open the developer tools (F12), **Network** tab.
2. Tick **Preserve log**, so a reload would not wipe the list and you could see it happen.
3. Click the Clear button (the circle with a line through it) to empty the list.
4. Click around: a recipe name, **Back to list**, the **Add** nav link, the **Recipes** nav link, another recipe.
5. Look at the **Type** column (or filter to **Doc**).

**Expected result:**

- There are **no `document` requests**. A full reload would show a new request for `localhost:5173/` or `/recipes/2` of type `document`, followed by the JS and CSS files again.
- You only see `fetch` requests to the API, for example `GET /api/recipes/2` when you open a recipe for the first time. Going back to the list shows one `GET /api/recipes`: TanStack Query shows the cached list at once and refreshes it in the background.
- For comparison, press F5 on a detail page. Now a `document` request for `/recipes/2` appears, then the scripts. That is what a full reload looks like, and only a reload or a typed URL causes one.

## Task: what client-side routing changes

Be ready to say what client-side routing does that the Jinja page reload didn't, and which Flask idea each of `$recipeId` and `<Outlet>` replaces.

**Model answer:** With the Jinja app every click asked the server for a whole new HTML page and the browser threw the old one away. With client-side routing the router matches the new URL in the browser and swaps only the page component, so the layout (login box, nav, anything typed into a field) stays and only the API data is fetched. `$recipeId` replaces Flask's `<int:recipe_id>` URL parameter (but arrives as a string, hence `Number(recipeId)`), and `<Outlet />` replaces `{% block content %}` in `base.html`, the slot where each page renders inside the shared layout.

## Files changed compared with L10

- `frontend/src/pages/RecipeDetailPage.tsx`: imports `Link` and adds the "Back to list" link.
- `README.md`: this file.
