# Lesson 8 homework — solutions

This is the finished code of Lesson 8 plus the homework, and it runs the same way as `L08` (see the run instructions in `L08/README.md`: `cd frontend`, `bun install`, `bun run dev`).

## Task: show the photo in `RecipeItem`

Show the recipe's photo in `RecipeItem` when a `thumb_url` exists, after adding the field to the `Recipe` type as optional.

**Solution:**

`frontend/src/types.ts` gets the new field. The `?` makes it optional, so the recipes that `App` builds from the form (which have no `thumb_url` at all) still match the type. `string | null` covers the API, which sends `null` when there is no thumbnail yet.

```ts
export type Recipe = {
  id: number;
  name: string;
  tag: string | null;
  servings: number | null;
  // optional (?): recipes made by the form have no photo, so they leave it out
  thumb_url?: string | null;
};
```

`frontend/src/components/RecipeItem.tsx` draws an `<img>` only when there is a `thumb_url`, the same idea as `{% if recipe.thumb_url %}` in the Jinja page. The photo and the name sit together on the left, so the servings stay on the right.

```tsx
<li className="p-3 rounded bg-white shadow flex justify-between items-center">
  <span className="flex gap-3 items-center">
    {recipe.thumb_url && (
      <img
        src={recipe.thumb_url}
        alt={recipe.name}
        className="w-12 h-12 rounded object-cover"
      />
    )}
    <span>
      {recipe.name}
      {recipe.tag && <> — {recipe.tag}</>}
    </span>
  </span>
  …
```

`w-12 h-12 object-cover` makes every photo a 48 px square and crops it instead of stretching it. `alt` gives screen readers (and a broken image) the recipe name.

**Verify:** the form can't add a photo, so test with a recipe you put into `App`'s starting state for a moment. Don't keep this change; the solution's `App.tsx` still starts with an empty list.

1. In `frontend/src/App.tsx`, temporarily change the state line to:

   ```tsx
   const [recipes, setRecipes] = useState<Recipe[]>([
     {
       id: 1,
       name: "Pancakes",
       tag: "breakfast",
       servings: 4,
       thumb_url: "https://picsum.photos/id/1080/200", // any image URL works
     },
   ]);
   ```

2. Run `bun run dev` and open `http://localhost:5173`. Pancakes shows a small square photo left of its name.
3. Add a recipe with the form. It shows without a photo, and nothing breaks: the `img` is simply not drawn.
4. Put the line back to `useState<Recipe[]>([])` and save.

## Task: a `servings` field with validation

Add a `servings` field to the form, with validation that it must be a positive number if provided.

**Solution:** `frontend/src/components/AddRecipeForm.tsx` gets a third `form.Field`, between the tag and the Add button. Nothing else changes: `servings` was already in `defaultValues` (as `""`), and `onSubmit` already turns it into a number or `null`.

```tsx
<form.Field
  name="servings"
  validators={{
    // empty is fine (servings is optional); anything else must be 1, 2, 3, …
    onChange: ({ value }) =>
      value === "" || (Number.isInteger(Number(value)) && Number(value) > 0)
        ? undefined
        : "Servings must be a positive whole number",
  }}
>
  {(field) => (
    <div>
      <input
        className="border rounded px-2 py-1 w-full"
        type="number"
        min="1"
        placeholder="Servings"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      {field.state.meta.errors[0] && (
        <p className="text-red-600 text-sm">{field.state.meta.errors[0]}</p>
      )}
    </div>
  )}
</form.Field>
```

It is the same shape as the `name` field: a validator returns a message when the value is wrong and `undefined` when it's fine, and the first error shows under the input. The value is still a string (a text box always holds one), so the validator converts it with `Number(value)`. `Number.isInteger` rejects `1.5`, and `> 0` rejects `0` and negative numbers. Rejecting `0` also avoids the catch from the lesson, where `{recipe.servings && …}` would draw a bare `0` in the list. `type="number" min="1"` gives the browser's number keyboard and arrows, like the Jinja form, but the validator is what enforces the rule.

TanStack Form runs the field validators again when you submit, so a wrong value blocks `onSubmit` and the recipe is not added.

**Verify:** run `bun run dev` and open `http://localhost:5173`.

| Type in Servings, then click Add | Expected |
| --- | --- |
| nothing | The recipe is added with no servings shown. |
| `4` | The recipe is added with "4 servings". |
| `0` | "Servings must be a positive whole number" under the field; nothing is added. |
| `-2` | The same error; nothing is added. |
| `1.5` | The same error; nothing is added. |

When you fix the value (for example change `0` to `3`), the error goes away as you type, and Add works.

## Task: props in Python terms, and the path from form to list

Be ready to say, in Python terms, what a prop is, and how a new recipe gets from the form to the list.

**Model answer:** A prop is an argument to a component, like a keyword argument to a Python function or a variable you pass to `render_template`; the component reads it and doesn't change it. `App` owns the recipes in its state and passes `AddRecipeForm` a function prop, `onAdd`; when you submit, the form calls `onAdd(newRecipe)`, `App`'s `addRecipe` calls `setRecipes` with a new array, React re-renders `App`, and `RecipeList` receives the longer list as its `recipes` prop and draws one more `RecipeItem`.

## Files changed compared with L08

- `frontend/src/types.ts` (optional `thumb_url`)
- `frontend/src/components/RecipeItem.tsx` (the photo)
- `frontend/src/components/AddRecipeForm.tsx` (the `servings` field and its validator)
- `README.md` (this file)
