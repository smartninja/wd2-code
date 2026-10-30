# Recipe Keeper backend — Arc B/C

The Lesson 6 backend, prepared for the React app (added in **Lesson 9**):

- `flask-cors` **with credentials** — `CORS(app, origins=["http://localhost:5173"],
  supports_credentials=True)` lets the browser app call the API across origins *and*
  send the session cookie.
- a small **`/api/me`** endpoint — the React app calls it on load to learn who's
  logged in (the session cookie survives a refresh).

Auth is unchanged from Lesson 3: one session-cookie login for pages and API, with
CSRF on writes. From **Lesson 11** the backend also carries automated `tests/`.

From **Lesson 11**, `main.py` is split into **blueprints** and an **app factory**:

| File | What's in it |
|---|---|
| `main.py` | `create_app()`: config, extensions, blueprints, CLI commands |
| `extensions.py` | `db`, `migrate`, `security`, `csrf`, `cors`, created without an app |
| `models.py` | `Recipe`, `User`, `Role` and the user datastore |
| `storage.py` | the R2 client and `store_photo()` |
| `pages.py` | the `pages` blueprint: server-rendered Jinja routes |
| `api.py` | the `api` blueprint (`/api/...`): schemas and JSON endpoints |
| `commands.py` | `flask create-admin` and `flask backup-recipes` |
| `tasks.py` | the Celery thumbnail task |

`flask ...` commands still work (`FLASK_APP=main` is set in `docker-compose.yml`): Flask finds `create_app` by name.

```bash
cp .env.example .env   # fill in R2_* (incl. R2_PUBLIC_URL)
docker compose up --build
# first run only:
docker compose exec api flask db upgrade
docker compose exec api flask create-admin   # me@example.com / supersecret
```

Interactive API docs: http://localhost:8000/docs

Run the backend tests (they use a separate `recipes_test` database, never your dev data):

```bash
docker compose exec db createdb -U recipes recipes_test   # first run only
docker compose exec api pytest
```
