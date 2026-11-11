# Recipe Keeper — end of Lesson 5

Adds background processing:
- a **Celery worker** (with a **Redis** broker) that generates a photo thumbnail the
  moment a photo is uploaded, and
- a **cron job** command, `flask backup-recipes`, that writes all recipes to JSON in R2.

## Run

1. Copy `.env.example` to `.env` and fill in the `R2_*` values (including `R2_PUBLIC_URL`).
2. `docker compose up --build` — starts `db`, `redis`, `api` and
   `worker`. Coming from Lesson 4? Run `docker compose down -v` first: the new `thumb_url`
   column only appears in a fresh database (`create_all()` never alters an existing table).
3. `docker compose exec api flask create-admin`, log in, upload a photo; the worker
   makes a thumbnail (watch the `worker` logs).
4. Run the backup by hand: `docker compose exec api flask backup-recipes`.

Starting point for Lesson 6.
