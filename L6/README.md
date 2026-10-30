# Recipe Keeper — Lesson 6 (Arc A · Server-Rendered)

A monorepo, the same shape every lesson: `backend/` (the Flask + PostgreSQL app in
Docker) and `frontend/` (the React app — **empty until Lesson 7**).

**This lesson:** Database migrations with Flask-Migrate — versioned schema changes you can upgrade and roll back.

## Run

```bash
cd backend
cp .env.example .env
docker compose up
```

See `backend/README.md` for the per-lesson steps. Each `L6` is the finished state
of Lesson 6 and the starting point for Lesson 7.
