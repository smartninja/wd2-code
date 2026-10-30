# Recipe Keeper — Lesson 12 (Arc C · Test & Ship)

Monorepo: `backend/` (the Flask API) + `frontend/` (the React app). **This lesson:** Test the frontend — Vitest + React Testing Library, testing components the way a user experiences them.

## Run (backend + frontend both live)

```bash
# terminal 1 — backend
cd backend && cp .env.example .env && docker compose up
# terminal 2 — frontend
cd frontend && bun install && bun run dev
```

Each `L12` is the finished state of Lesson 12 and the starting point for Lesson 13.
