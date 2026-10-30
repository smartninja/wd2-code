# Recipe Keeper — Lesson 5 (Arc A · Server-Rendered)

A monorepo, the same shape every lesson: `backend/` (the Flask + PostgreSQL app in
Docker) and `frontend/` (the React app — **empty until Lesson 7**).

**This lesson:** Background jobs: a Celery worker (thumbnails) and a cron backup, with Redis as the broker.

## Run

```bash
cd backend
cp .env.example .env
docker compose up
```

See `backend/README.md` for the per-lesson steps. Each `L5` is the finished state
of Lesson 5 and the starting point for Lesson 6.
