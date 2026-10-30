# Recipe Keeper — Lesson 9 (Arc B · Single-Page App)

Monorepo: `backend/` (the Flask API) + `frontend/` (the React app). **This lesson:** The frontend meets the backend — TanStack Query for reads, mutations for create/delete, cookie login + CSRF. **The backend gains `flask-cors` (with credentials) and `/api/me` this lesson.**

## Run (backend + frontend both live)

```bash
# terminal 1 — backend
cd backend && cp .env.example .env && docker compose up
# terminal 2 — frontend
cd frontend && bun install && bun run dev
```

Each `L9` is the finished state of Lesson 9 and the starting point for Lesson 10.
