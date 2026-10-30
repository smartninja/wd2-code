# Recipe Keeper — Lesson 3 (Arc A · Server-Rendered)

A monorepo, the same shape every lesson: `backend/` (the Flask + PostgreSQL app in
Docker) and `frontend/` (the React app — **empty until Lesson 7**).

**This lesson:** Authentication & authorization: one session-cookie login for pages and API, with CSRF protection on writes.

## Run

```bash
cd backend
cp .env.example .env
docker compose up
```

See `backend/README.md` for the per-lesson steps. Each `L3` is the finished state
of Lesson 3 and the starting point for Lesson 4.
