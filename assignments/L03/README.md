# Lesson 3 homework — solutions

This folder is the finished code of lesson 3 plus the homework, and it runs the same way as `L03` (see the run instructions in `L03/README.md`: `cd backend`, `cp .env.example .env`, `docker compose up`, then `docker compose exec api flask create-admin`).

## Task: an `editor` role that may update

Asked: add a second role, `editor`, and let only editors and admins update a recipe.

**Solution:** one file changed, `backend/main.py`.

1. `roles_accepted` is added to the `from flask_security import (...)` list.
2. The update endpoint gets one more decorator, under `@auth_required("session")`:

```python
@app.put("/api/recipes/<int:recipe_id>")
@auth_required("session")
# roles_accepted = ANY one of these roles is enough (roles_required needs ALL)
@roles_accepted("editor", "admin")
@app.input(RecipeIn)
@app.output(RecipeOut)
def update_recipe(recipe_id, json_data):
    # ... unchanged
```

The order follows the lesson's rule: the route line on top, then "who are you?" (`@auth_required`), then "may you do this?" (`@roles_accepted`), then the input check. `@roles_required("editor", "admin")` would be wrong here: it would demand that one user has *both* roles. Delete keeps `@roles_required("admin")`, so an editor still cannot delete.

3. A repeatable way to create an editor, written like `create-admin`:

```python
@app.cli.command("create-editor")
def create_editor():
    """Create a default editor user (editor@example.com / supersecret)."""
    # Same pattern as create-admin: the role first, then the user, so running it
    # twice is safe.
    user_datastore.find_or_create_role(name="editor", description="Editor")
    if not user_datastore.find_user(email="editor@example.com"):
        user_datastore.create_user(
            email="editor@example.com",
            password=hash_password("supersecret"),
            roles=["editor"],
        )
    db.session.commit()
    print("editor ready: editor@example.com / supersecret")
```

Run it from `backend/` while the stack is up:

```bash
docker compose exec api flask create-editor
```

It prints `editor ready: editor@example.com / supersecret`, and running it again prints the same line without creating a duplicate. No restart is needed: `--debug` reloads `main.py` when it changes, and `flask create-editor` loads the current file anyway.

**The Flask shell way from the homework** gives the same result by hand. Run `docker compose exec api flask shell`, then, one line at a time:

```python
from flask_security import hash_password
from main import db, user_datastore
user_datastore.find_or_create_role(name="editor")
user_datastore.create_user(email="editor@example.com", password=hash_password("supersecret"), roles=["editor"])
db.session.commit()
exit()
```

The role must exist before `create_user(..., roles=["editor"])` can find it by name, which is why `find_or_create_role` comes first. Use either the command or the shell, not both: the shell version doesn't check for an existing user, so running it after the command fails on the unique email.

You also need a user with no role. If you don't still have `cook@example.com` from the lesson, create it in the Flask shell exactly as in lesson 3 (`create_user(email="cook@example.com", password=hash_password("supersecret"))`, then `db.session.commit()`).

## Task: verify the four cases

Asked: an editor can update but not delete; an admin can do both; a logged-in user with no role can do neither; a logged-out request can do neither.

**Verify** in Bruno, as in lesson 3 Step 7 (all URLs start with `http://localhost:8000`). First make sure there are at least two recipes (`GET /api/recipes`) and note two `id`s per user you test, since every successful delete removes one. For each user:

1. **POST `/logout`** (no header needed), then **POST `/login`** with that user's JSON body, for example `{"email": "editor@example.com", "password": "supersecret"}`, and copy the `XSRF-TOKEN` value from the response.
2. **PUT `/api/recipes/<id>`** with `{"name": "Edited"}` and the `X-CSRF-Token` header.
3. **DELETE `/api/recipes/<another id>`** with the same header.

For the logged-out case, send **POST `/logout`**, then **GET `/`** once to receive a fresh `XSRF-TOKEN`, and send the PUT and DELETE with that token in the header.

| Who | PUT | DELETE |
| --- | --- | --- |
| `editor@example.com` (role `editor`) | `200` | `403 Forbidden` |
| `me@example.com` (role `admin`) | `200` | `204` |
| `cook@example.com` (no role) | `403 Forbidden` | `403 Forbidden` |
| logged out | `401` | `302` redirect to `/login` (or `401` if you add an `Accept: application/json` header) |

Notes on the table:

- The cook's `PUT` used to return `200` in lesson 3 (Step 7, check 8). The `403` is the new rule working: a login alone is no longer enough to edit.
- The logged-out `DELETE` has no body, so Flask-Security doesn't treat it as JSON and answers like it would a browser, with a redirect to the login page (the status-code ladder in lesson 3, Step 6). If Bruno follows the redirect, you see the login page HTML with `200`; either way, the recipe is still there (check with `GET /api/recipes`).
- Without the `X-CSRF-Token` header, every one of these writes returns `400` first, before any role check.

In the browser, the editor sees the add form but no Delete buttons, because the page only shows them to admins (`current_user.has_role("admin")` in `templates/recipes.html`). The pages have no edit form, so updating is only possible through the API.

## Task: why we never write our own password hashing

**Model answer:** Password hashing is easy to get subtly wrong (a fast hash, no salt, a weak comparison) and the mistake stays invisible until the database leaks, so we use a vetted, maintained library (Flask-Security-Too with argon2) built and reviewed by specialists instead of code we, or an AI, wrote ourselves.

## Files changed compared with L03

- `backend/main.py` (`roles_accepted` import, `@roles_accepted("editor", "admin")` on `update_recipe`, the `create-editor` command)
- `README.md` (this file)
