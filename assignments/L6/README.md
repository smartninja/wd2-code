# Lesson 6 homework — solutions

This folder is the finished Lesson 6 code plus the homework, and it runs the same way as `L6` (see the Run steps in `L6/README.md` and `L6/backend/README.md`).

## Task: add `created_at` and its migration

Add a nullable `created_at` timestamp to `Recipe`, generate and apply the migration, and read its `upgrade()` and `downgrade()`.

**Solution:**

`backend/main.py`, in the `Recipe` model (`datetime` and `timezone` are already imported for the backup command):

```python
    servings = db.Column(db.Integer)
    # When the row was created. Nullable, because recipes that existed before this
    # column have no value for it. default= fills it in for every new recipe.
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
```

`db.Column` is nullable unless you say `nullable=False`, so existing recipes simply get `NULL`. The `default=` runs in Python each time a new recipe is saved. It is a `lambda` so that the time is taken at save time, not once when the app starts.

The homework doesn't ask to show the date anywhere, so `RecipeOut` and the page are unchanged.

`backend/migrations/versions/3b8e1d7a9c42_add_created_at.py` is the migration, the file `docker compose exec api flask db migrate -m "add created_at"` writes. Its `down_revision` is `f4515ac65628`, so it comes after "add servings":

```python
revision = '3b8e1d7a9c42'
down_revision = 'f4515ac65628'


def upgrade():
    with op.batch_alter_table('recipe', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=True))


def downgrade():
    with op.batch_alter_table('recipe', schema=None) as batch_op:
        batch_op.drop_column('created_at')
```

Reading it: `upgrade()` adds one nullable column, and `downgrade()` drops that same column. The Python `default=` is not in the migration, because it lives in the app, not in the database. If you generate the file yourself, your revision ID and date will differ.

**Verify:**

1. `docker compose exec api flask db upgrade`. Expected: `Running upgrade f4515ac65628 -> 3b8e1d7a9c42, add created_at`.
2. `docker compose exec db psql -U recipes -c '\d recipe'`. Expected: a `created_at` column of type `timestamp without time zone`.
3. Add a recipe on the page, then `docker compose exec db psql -U recipes -c 'select id, name, created_at from recipe'`. Expected: the older recipes show an empty `created_at`, the new one shows the current UTC time.

## Task: downgrade, upgrade, and confirm recipes survive

**Verify:**

1. `docker compose exec api flask db downgrade`. Expected: `Running downgrade 3b8e1d7a9c42 -> f4515ac65628, add created_at`. Run `\d recipe` again: `created_at` is gone. (The page errors until you upgrade again, because the code expects the column.)
2. `docker compose exec api flask db upgrade`. Expected: `Running upgrade f4515ac65628 -> 3b8e1d7a9c42, add created_at`.
3. Reload `http://localhost:8000/` and run the `select` again. Expected: every recipe is still there with its name, tag and servings. The `created_at` column is back, but it is empty for every row, including the recipe you added in the previous task.

## Task: why a rollback can undo a column but not always its data

**Model answer:** `downgrade()` undoes the structure: it drops the column, and the values stored in it are deleted with it. Upgrading again only creates a new, empty column, because the migration describes the shape of the table, not what was in it, so lost data can only come back from a backup.

## Task: revert afterwards

The homework's last step is to run `docker compose exec api flask db downgrade` and then delete the `created_at` line and the migration file, so your own code matches the course repo again. This solution folder keeps both on purpose, so you can see the finished change.

If you ran this folder against your database and want to go back to the `L6` code, run `docker compose exec api flask db downgrade` first, while the migration file still exists. If you delete the file first, Alembic stops with `Can't locate revision identified by '3b8e1d7a9c42'`.

## Files changed compared with L6

- `backend/main.py`: `created_at` column on `Recipe`.
- `backend/migrations/versions/3b8e1d7a9c42_add_created_at.py`: new migration, after `f4515ac65628`.
- `README.md`: this file.
