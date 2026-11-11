# Lesson 7 homework — solutions

This is the finished code of Lesson 7 plus the homework, and it runs the same way as `L07` (see the run instructions in `L07/README.md`: `cd frontend`, `bun install`, `bun run dev`).

## Task: a footer with Tailwind

Add a second heading or a footer to `App.tsx` using Tailwind classes, and confirm that hot-reload shows it instantly.

**Solution:** `frontend/src/App.tsx` gets a `<footer>` under the list, inside the same wrapper `<div>`. It is styled only with Tailwind classes, so no CSS file changes.

```tsx
      </ul>
      {/* styled with Tailwind classes only, no CSS file */}
      <footer className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">
        Recipe Keeper · built with React and Tailwind
      </footer>
    </div>
```

What the classes do: `mt-8` adds space above it, `pt-4 border-t border-gray-200` draws a light line with some padding under it, and `text-sm text-gray-500 text-center` makes the text small, grey and centred. `border-gray-200` is there because Tailwind 4 draws borders in the text colour by default, which would give a dark line.

**Verify:**

1. `cd frontend`, `bun install`, `bun run dev`, and open `http://localhost:5173`.
2. Under the two recipes you see a thin grey line and the small grey text "Recipe Keeper · built with React and Tailwind".
3. With the page still open, change the footer text in `App.tsx` and save. The page updates within a second, without a reload and without you touching the browser. That is Vite's hot-reload.

## Task: label the Jinja page as React components

Skim the Jinja `recipes.html` and, on paper, label which React component each part will become.

**Answer:** this is the decomposition from the lesson's diagram, applied to `L06/backend/templates/recipes.html`, top to bottom.

| Part of `recipes.html` | Becomes | Notes |
| --- | --- | --- |
| `<head>` with `<title>Recipe Keeper</title>` and the `style.css` link | not a component | The title moves to `frontend/index.html`, and Tailwind (loaded through `index.css`) replaces `style.css`. |
| `<main>` and `<h1>Recipes</h1>` | `App` | The top of the component tree. It holds the heading and puts the other components on the page. |
| `{% if current_user.is_authenticated %}` with "Signed in as {{ current_user.email }}" and the Log out form, and the `{% else %}` "Log in" link | `AuthStatus` | One component for both states: who is signed in with a Log out button, or a way to log in. In React it shows a small login form instead of linking to `/login`. |
| `<form method="post" action="/recipes">` with the `name`, `tag` and `servings` inputs and "Add recipe" | `AddRecipeForm` | It no longer posts to the server and reloads the page. It hands the new recipe to its parent. |
| `<ul>` with `{% for recipe in recipes %}` and the `{% else %}` "No recipes yet." | `RecipeList` | Loops over the recipes and shows "No recipes yet." when there are none. |
| One `<li>`: name, tag, servings, the photo (`thumb_url` or `image_url`) and the Delete button | `RecipeItem` | One component, used once per recipe. The `{% if recipe.tag %}`-style checks become `&&` in JSX. |
| The per-recipe "Upload photo" form inside the `<li>` | part of `RecipeItem` | Every per-recipe action belongs to the row. The course's React app doesn't build photo upload; that stays on the Jinja page. |
| The hidden `csrf_token` inputs | not a component | In the React app, `api.ts` sends the CSRF token in a header on every write (lesson 9). |

The shared data becomes typed entities rather than components: a `Recipe` type, an `api.ts` module for the HTTP calls, and TanStack Query hooks (`useRecipes`, `useCreateRecipe`, `useDeleteRecipe`) from lesson 9.

The tree you should end up with:

```
App
├── AuthStatus
├── AddRecipeForm
└── RecipeList
    ├── RecipeItem
    ├── RecipeItem
    └── …
```

**Verify:** compare your labels with the diagram in Part 5 of the lesson. Each region of the page should map to exactly one of the five components.

## Task: what React gives you, and what it leaves to you

Be ready to say, in one sentence, what React gives you and what it deliberately leaves to you.

**Model answer:** React gives you components and state, a way to build the UI from pieces and keep it updated when the data changes, and deliberately leaves everything else to you: routing, data fetching, forms, styling and the build tool, which is why this arc adds Bun and Vite, TanStack and Tailwind.

## Files changed compared with L07

- `frontend/src/App.tsx` (the footer)
- `README.md` (this file)
