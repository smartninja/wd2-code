# Recipe Keeper — Lesson 4 (Arc A · Server-Rendered)

A monorepo, the same shape every lesson: `backend/` (the Flask + PostgreSQL app in
Docker) and `frontend/` (the React app — **empty until Lesson 7**).

**This lesson:** Photo upload to Cloudflare R2 (S3-compatible object storage).

## Run

```bash
cd backend
cp .env.example .env
docker compose up
```

See `backend/README.md` for the per-lesson steps. Each `L4` is the finished state
of Lesson 4 and the starting point for Lesson 5.
