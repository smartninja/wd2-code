# Recipe Keeper — Lesson 15 (Arc C · Test & Ship)

Monorepo: `backend/` + `frontend/`. **This lesson:** make the backend production-ready,
deploy the whole app to a **staging environment** on Render, and let the Semaphore
pipeline decide when it deploys.

New in the code:
- `backend/main.py` — a `/health` endpoint for the platform's health check.
- `backend/requirements.txt` + `backend/Dockerfile` — `gunicorn`, and a production `CMD`
  that runs `flask db upgrade` and then gunicorn on Render's `$PORT` (docker compose
  still overrides the command for local dev).
- `frontend/.env.example` — how `VITE_API_URL` is set on Render.
- `.semaphore/semaphore.yml` — the placeholder Deploy block from lesson 14 is now
  **Deploy staging**: it runs on `main` only and calls the staging services' deploy
  hooks from the `render-staging-hooks` secret.

On Render (staging): a backend Web Service (Docker, `backend/`, health check path
`/health`), Postgres, Key Value and a Static Site
(`frontend/`, build `bun install && bun run build`, publish `dist`) with `VITE_API_URL`
set to its own URL and these rewrites, in order: `/api/*` → `https://<backend>.onrender.com/api/*`,
`/login` → `…/login`, `/logout` → `…/logout`, `/*` → `/index.html`. Auto-Deploy is off on
every service; the pipeline deploys.

Everything runs on Render's free tier. The thumbnail worker needs Render's paid
Background Worker, so on the free tier thumbnails stay queued; the lesson explains the
concept instead of setting one up.

Production and error tracking come in lesson 16.
