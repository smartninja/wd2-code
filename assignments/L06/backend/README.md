# Recipe Keeper — end of Lesson 6

Replaces the `create_all()` shortcut with **Flask-Migrate** (Alembic) migrations, and
adds a `servings` column — the kind of change to a live table that migrations exist for.

## Run

1. Copy `.env.example` to `.env`, then `docker compose up`.
2. Apply the migrations. The `migrations/` folder is part of the code (committed, like
   `main.py`): `initial schema`, then `add servings`.
   ```bash
   docker compose exec api flask db upgrade
   ```
3. `docker compose exec api flask create-admin`, then use the app as before.

When you change a model later, run `flask db migrate -m "..."` then `flask db upgrade`.
`flask db upgrade --sql` prints the SQL without running it; `flask db downgrade` reverses.

Starting point for Lesson 7.
