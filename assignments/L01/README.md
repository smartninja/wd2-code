# Lesson 1 homework — solutions

This folder is the finished code of lesson 1 plus the homework, and it runs the same way as `L01` (see the run instructions in `L01/README.md`: `cd backend`, `cp .env.example .env`, `docker compose up`).

## Task: a `?tag=` filter on the page

Asked: make `/?tag=breakfast` show only the breakfast recipes.

**Solution:** one file changed, `backend/main.py`.

- `request` is imported from `flask` next to `render_template`.
- The `/` route reads the tag from the URL and, only when one is given, narrows the query before sorting it:

```python
@app.route("/")
def recipe_list():
    query = Recipe.query
    # /?tag=breakfast keeps only that tag; with no ?tag= it is None and we show all
    tag = request.args.get("tag")
    if tag:
        query = query.filter_by(tag=tag)
    recipes = query.order_by(Recipe.id).all()
    return render_template("recipes.html", recipes=recipes)
```

`request.args` holds the part of the URL after `?`. `get("tag")` returns `None` when it is missing, so the `if` skips the filter and the page lists every recipe, as before. An empty `/?tag=` is treated the same way. The template does not change: when nothing matches, its `{% else %}` branch already prints "No recipes yet."

**Verify:** with the stack running, add a few rows from a second terminal in `backend/`:

```bash
docker compose exec db psql -U recipes -d recipes -c \
  "INSERT INTO recipe (name, tag) VALUES ('Pancakes', 'breakfast'), ('Tomato soup', 'dinner'), ('Omelette', 'breakfast');"
```

Then open:

| URL | Expected |
| --- | --- |
| http://localhost:8000/ | all three recipes |
| http://localhost:8000/?tag=breakfast | Pancakes and Omelette only |
| http://localhost:8000/?tag=lunch | "No recipes yet." |

## Task (the alternative, not implemented here): an `ingredients` field

The homework offered a second option instead of the filter. In words, it would be:

1. Add a column to the model in `backend/main.py`: `ingredients = db.Column(db.String)` under `tag`.
2. Show it in `backend/templates/recipes.html`, for example `{% if recipe.ingredients %}<p>{{ recipe.ingredients }}</p>{% endif %}` inside the `<li>`.
3. Reset the database. `db.create_all()` only creates tables that are missing; it never adds a column to the `recipe` table that already exists, so without a reset the page fails with a "column recipe.ingredients does not exist" error. Stop the stack and run `docker compose down -v`, which also deletes the `dbdata` volume (and every recipe in it), then `docker compose up`. `create_all()` now creates the table with the new column.
4. Insert a row that has ingredients, for example `INSERT INTO recipe (name, tag, ingredients) VALUES ('Pancakes', 'breakfast', 'flour, milk, eggs');`, and reload the page.

Lesson 6 shows the proper way to change a table that already holds data (migrations), without throwing the data away.

## Task: run the verify loop

Asked: check a normal case, an empty case, and reload to confirm nothing broke.

**Verify:**

1. Normal case: http://localhost:8000/?tag=breakfast shows only the breakfast recipes.
2. Empty case: http://localhost:8000/?tag=lunch (a tag no recipe has) shows "No recipes yet." with a normal page, not an error. With an empty table, http://localhost:8000/ shows the same message.
3. Reload: refresh http://localhost:8000/ and it still lists every recipe, so the unfiltered page works as before. The terminal running `docker compose up` shows `200` for each request and no traceback.

## Task: why the database password isn't in the code

**Model answer:** Code is committed and shared, so a password written in it would be visible to everyone who can see the repository, forever; it lives in `.env` (never committed) and reaches the app as an environment variable, which also lets the same code run against a different database with only a change to the environment.

## Files changed compared with L01

- `backend/main.py` (the `?tag=` filter)
- `README.md` (this file)
