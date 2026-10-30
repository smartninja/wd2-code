# Recipe Keeper — Lesson 1 (Arc A · Server-Rendered)

A monorepo, the same shape every lesson: `backend/` (the Flask + PostgreSQL app in
Docker) and `frontend/` (the React app — **empty until Lesson 7**).

**This lesson:** Docker + Flask + PostgreSQL, serving your first server-rendered Jinja page from the database.

## Run

```bash
cd backend
cp .env.example .env
docker compose up
```

See `backend/README.md` for the per-lesson steps. Each `L1` is the finished state
of Lesson 1 and the starting point for Lesson 2.
