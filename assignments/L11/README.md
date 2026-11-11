# Lesson 11 homework — solutions

This folder is the finished code of Lesson 11 plus the homework, and it runs the same way as `L11` (see the run instructions in `L11/README.md`: `docker compose up` in `backend/`, then `bun install && bun run dev` in `frontend/`).

## Task: tests for update and delete

Add two tests with `auth_client`: `PUT` a new tag on a recipe (sending the name too) and check `200` and the new tag; `DELETE` a recipe, check `204`, then check that `GET` gives `404`.

**Solution:** two tests appended to `backend/tests/test_recipes.py`. They use the existing `auth_client` fixture from `tests/conftest.py`, so no fixture changes are needed. Each test first creates its own recipe and reads its `id` from the `201` response, because every test starts with empty tables.

```python
def test_update_recipe(auth_client):
    recipe_id = auth_client.post("/api/recipes", json={"name": "Soup"}).get_json()["id"]
    # PUT replaces the whole recipe, and RecipeIn requires name, so send it too
    resp = auth_client.put(f"/api/recipes/{recipe_id}", json={"name": "Soup", "tag": "dinner"})
    assert resp.status_code == 200
    assert resp.get_json()["tag"] == "dinner"


def test_delete_recipe(auth_client):
    # the fixture's test user is an admin, so it passes @roles_required("admin")
    recipe_id = auth_client.post("/api/recipes", json={"name": "Toast"}).get_json()["id"]
    assert auth_client.delete(f"/api/recipes/{recipe_id}").status_code == 204
    assert auth_client.get(f"/api/recipes/{recipe_id}").status_code == 404
```

Two details:

- Leaving out `"name"` in the `PUT` body would give `422`, the same rule `test_create_requires_name` checks for `POST`, because `update_recipe` uses the same `RecipeIn` schema.
- `DELETE` needs the `admin` role (lesson 3). The `app` fixture gives the test user `t@example.com` that role, so `auth_client` is allowed to delete.

**Verify:** from `backend/`, with `docker compose up` running:

```bash
docker compose exec api pytest
```

Expected: `7 passed` (the 5 tests from the lesson plus these 2). To see a test catch a bug, change `recipe.tag = json_data.get("tag")` in `update_recipe` to `recipe.tag = None`, run again: `test_update_recipe` fails on the tag assertion. Put the line back.

## Task: docstrings in `/docs`

Add a one-line docstring to `get_recipe` and `create_recipe` in `api.py` and confirm they show in `/docs`.

**Solution:** `backend/api.py`. `list_recipes` and `me` already had docstrings from the lesson; `get_recipe` and `create_recipe` get one line each, right under the `def`:

```python
def get_recipe(recipe_id):
    """Get one recipe by its id, or 404 if there is none."""
    return db.get_or_404(Recipe, recipe_id)
```

```python
def create_recipe(json_data):
    """Create a recipe. Requires a logged-in user."""
    recipe = Recipe(
```

A one-line docstring becomes the endpoint's summary. There is no blank line and second paragraph, so there is no longer description, unlike `list_recipes`.

**Verify:** open `http://localhost:8000/docs` (reload if it was open).

- `GET /api/recipes/{recipe_id}` shows "Get one recipe by its id, or 404 if there is none." instead of "Get Recipe".
- `POST /api/recipes` shows "Create a recipe. Requires a logged-in user." instead of "Create Recipe".
- `PUT` and `DELETE` still show the generated "Update Recipe" and "Delete Recipe", because they have no docstring.

The same text is in the raw spec: `http://localhost:8000/openapi.json`, under `paths` → `/api/recipes/{recipe_id}` → `get` → `summary`.

## Task: separate test database and `create_app`

Be ready to say why tests run against a separate database, and what `create_app` lets a test do that `from main import app` couldn't.

**Model answer:** The tests create and delete recipes and drop every table when they finish, so running them against the real database would wipe your data; a separate `db-test` database can be wrecked safely, and every test starts from the same empty state. With `from main import app`, the app is built and connected to the database from `DATABASE_URL` the moment it is imported, before a test can change anything. `create_app(test_config)` lets the test build its own fresh app with its own settings (the test database, `TESTING`, no CSRF) applied before anything connects.

## Files changed compared with L11

- `backend/tests/test_recipes.py`: adds `test_update_recipe` and `test_delete_recipe`.
- `backend/api.py`: one-line docstrings on `get_recipe` and `create_recipe`.
- `README.md`: this file.
