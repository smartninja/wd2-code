# Recipe Keeper — Lesson 13 (Arc C · Test & Ship)

Monorepo: `backend/` (the Flask API) + `frontend/` (the React app, now with
**Playwright end-to-end tests** in `frontend/e2e/`). **This lesson:** an E2E test
drives a real browser through log in → add recipe → see it persist, exercising the
SPA, API and database together, and keeps a trace/video/screenshot on failure.

## Run (both servers up)

```bash
cd backend && cp .env.example .env && docker compose up   # + flask create-admin
cd frontend && bun install && bun run dev
# then, in a third shell:
cd frontend && bunx playwright install chromium && bun run e2e
```

A failed run: `bunx playwright show-report` opens the trace. This is the finished
state of Lesson 13 and the start of Lesson 14 (CI).
