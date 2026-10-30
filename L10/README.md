# Recipe Keeper — Lesson 10 (Arc B · Single-Page App)

Monorepo: `backend/` (the Flask API) + `frontend/` (the React app). **This lesson:** Multiple screens with TanStack Router — list, detail and add pages, navigating client-side with no full reloads.

## Run (backend + frontend both live)

```bash
# terminal 1 — backend
cd backend && cp .env.example .env && docker compose up
# terminal 2 — frontend
cd frontend && bun install && bun run dev
```

Each `L10` is the finished state of Lesson 10 and the starting point for Lesson 11.
