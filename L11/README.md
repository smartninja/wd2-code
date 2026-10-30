# Recipe Keeper — Lesson 11 (Arc C · Test & Ship)

Monorepo: `backend/` (the Flask API) + `frontend/` (the React app). **This lesson:** Test & document the backend — pytest against a test database, the auth gate, and the Swagger UI at `/docs`. **The backend gains its `tests/` this lesson, and `main.py` is split into blueprints (`pages.py`, `api.py`) and an app factory (`create_app()`) so tests can build the app against the test database.**

## Run (backend + frontend both live)

```bash
# terminal 1 — backend
cd backend && cp .env.example .env && docker compose up
# terminal 2 — frontend
cd frontend && bun install && bun run dev
```

Each `L11` is the finished state of Lesson 11 and the starting point for Lesson 12.
