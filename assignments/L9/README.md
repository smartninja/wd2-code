# Lesson 9 homework — solutions

This is the finished code of Lesson 9 plus the homework, and it runs the same way as `L9` (see the run instructions in `L9/README.md`: the backend with `docker compose up` in `backend/`, the frontend with `bun install` and `bun run dev` in `frontend/`). The backend is unchanged; all homework changes are in `frontend/`.

## Task: `getRecipe(id)` and `useRecipe(id)`

Add a `getRecipe(id)` to `api.ts` (a `GET /api/recipes/<id>`) and a `useRecipe(id)` hook.

**Solution:** both are identical to what lesson 10 uses for the detail page (`L10/frontend`).

`frontend/src/api.ts` gets a second read function, right after `getRecipes`. It's the same shape: a `GET` with the session cookie, an error if the response isn't OK, and the parsed JSON typed as one `Recipe`.

```ts
export async function getRecipe(id: number): Promise<Recipe> {
  const res = await fetch(`${API}/api/recipes/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load recipe");
  return res.json();
}
```

`frontend/src/hooks/useRecipe.ts` is a new file:

```ts
import { useQuery } from "@tanstack/react-query";
import { getRecipe } from "../api";

export function useRecipe(id: number) {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => getRecipe(id),
  });
}
```

- `queryKey: ["recipes", id]` stores each recipe under its own label, starting with `"recipes"`. Invalidating `["recipes"]` also matches every key that starts with it, so the mutations you already have refresh one recipe as well as the list.
- `queryFn: () => getRecipe(id)` is a small arrow function, because Query calls `queryFn` without arguments and `getRecipe` needs the `id`.

Nothing on this lesson's single page uses the hook yet. Lesson 10's detail page is the first caller.

**Verify:**

1. In `frontend/`, `npx tsc -b` finishes with no errors (the new code type-checks).
2. With the backend running, open `http://localhost:8000/api/recipes/1` in the browser. You get one recipe as JSON, which is what `getRecipe(1)` returns. An id that doesn't exist gives a 404, which `getRecipe` turns into an error.
3. Compare with `L10/frontend/src/api.ts` and `L10/frontend/src/hooks/useRecipe.ts`: the code is the same.

## Task: an edit control for the tag

Build an edit control for one field (the tag) that calls `useUpdateRecipe().mutate({ id, input })`, and check that an edit persists after a refresh and shows on the Jinja page.

**Solution:** each row gets an "Edit tag" button. Clicking it swaps the tag for an input with Save and Cancel. The mutation lives in `App`, like the delete, and reaches the row as a callback prop through `RecipeList`.

`frontend/src/App.tsx` calls the hook and passes a callback down:

```tsx
const update = useUpdateRecipe();
…
{update.isError && (
  <p className="text-red-600 mb-4">Couldn't update the recipe. Are you logged in?</p>
)}
…
<RecipeList
  recipes={recipes}
  onDelete={(id) => remove.mutate(id)}
  // one object, because a mutation takes exactly one argument
  onUpdate={(id, input) => update.mutate({ id, input })}
/>
```

`frontend/src/components/RecipeList.tsx` only passes the new `onUpdate` prop on to every `RecipeItem`, the same way it passes `onDelete`.

`frontend/src/components/RecipeItem.tsx` keeps two pieces of local state: whether this row is being edited, and the text in the input. Only this row needs them, so they don't go up to `App`.

```tsx
const [editing, setEditing] = useState(false);
const [tag, setTag] = useState("");

function startEditing() {
  setTag(recipe.tag ?? ""); // start from the saved tag
  setEditing(true);
}

function save() {
  // PUT replaces the whole recipe and requires a name, so send every field,
  // not just the tag that changed.
  onUpdate(recipe.id, { name: recipe.name, tag, servings: recipe.servings });
  setEditing(false);
}
```

- `recipe.tag ?? ""` uses an empty input when the recipe has no tag (`null`).
- The full input matters: `PUT /api/recipes/<id>` uses `RecipeIn`, where `name` is required. Sending only `{ tag }` gets a `422`, and leaving out `servings` would set it to `null`.
- On success, `useUpdateRecipe` invalidates `["recipes"]` (from the lesson), so the list refetches and shows the saved tag. The row never changes the list itself.
- Cancel just closes the editor. Nothing is sent.

**Verify:** start the backend and the frontend as in `L9/README.md`, open `http://localhost:5173`, and log in as `me@example.com` / `supersecret` (run `docker compose exec api flask create-admin` first if you haven't). Add a recipe if the list is empty.

1. Click "Edit tag" on a recipe. An input with its current tag appears, with Save and Cancel.
2. Change the tag to `brunch` and click Save. The row shows "— brunch".
3. In the Network tab (F12) you see `PUT /api/recipes/<id>` with status 200, followed by a fresh `GET /api/recipes`. That `GET` is the invalidation.
4. Refresh the page. The tag is still `brunch`, so it was saved in the database.
5. Open the Jinja page at `http://localhost:8000/`. The same recipe shows the `brunch` tag.
6. Click "Edit tag", type something, click Cancel. The old tag stays and no `PUT` is sent.
7. Log out and try Save again. The red "Couldn't update the recipe. Are you logged in?" appears, because the API refuses a write without a login, and the tag stays as it was.

## Task: what TanStack Query adds, and why every mutation invalidates

Be ready to say what TanStack Query does that plain `fetch` doesn't, and why every mutation invalidates the recipes query.

**Model answer:** `fetch` only sends a request and hands back the response; TanStack Query does the bookkeeping around it: it caches the result under a key shared by every component, gives you `isLoading` and `isError`, and refetches when you tell it the data has changed. After a create, update or delete, the recipes it has cached are out of date, so invalidating `["recipes"]` makes it refetch, and the screen shows what is really in the database instead of what we hoped we saved.

## Files changed compared with L9

- `frontend/src/api.ts` (`getRecipe`)
- `frontend/src/hooks/useRecipe.ts` (new, `useRecipe`)
- `frontend/src/App.tsx` (`useUpdateRecipe`, its error message and the `onUpdate` prop)
- `frontend/src/components/RecipeList.tsx` (passes `onUpdate` on)
- `frontend/src/components/RecipeItem.tsx` (the "Edit tag" control)
- `README.md` (this file)
