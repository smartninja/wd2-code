# Recipe Keeper — Lesson 15 (Arc C · Test & Ship)

Monorepo: `backend/` + `frontend/`. **This lesson:** deploy to Render through the
pipeline, run a **separate staging environment** (its own R2 bucket, database and
secrets — same code, different env vars), and make the app observable.

New in the code:
- `backend/main.py` — a `/health` endpoint for the platform's health check, and an
  optional **Sentry** error tracker gated on `SENTRY_DSN` (only runs where set).
- `backend/.env.example` — `SENTRY_DSN` plus a note that `R2_BUCKET`, `DATABASE_URL`
  and the secrets differ between staging and production.
- `backend/requirements.txt` + `backend/Dockerfile` — `gunicorn`, and a production `CMD`
  that runs `flask db upgrade` and then gunicorn on Render's `$PORT` (docker compose
  still overrides the command for local dev).

The pipeline, environments, health-check path and secrets are configured in the
Semaphore and Render dashboards (see the lesson). Per environment on Render:

- **backend** Web Service (Docker, `backend/`) + **Postgres**; health check path `/health`.
- **frontend** Static Site (`frontend/`, build `bun install && bun run build`, publish
  `dist`), `VITE_API_URL` = the static site's own URL, and these rewrite rules in order,
  so the browser sees one site and the session/CSRF cookies work:
  `/api/*` → `https://<backend>.onrender.com/api/*`, `/login` → `…/login`,
  `/logout` → `…/logout`, `/*` → `/index.html`.
- **Key Value** (its internal URL is `REDIS_URL`) and a **Background Worker** (same
  Dockerfile, command `celery -A tasks.celery_app worker --loglevel=info`). Workers have
  no free tier; without one, uploads still work and thumbnails wait in the queue.
- First admin: `flask roles create admin`, `flask users create you@yourdomain.com --active`,
  `flask roles add you@yourdomain.com admin`, run against the environment's external
  database URL. Never `flask create-admin` (its password is in the code).

This is the finished, shippable app.
