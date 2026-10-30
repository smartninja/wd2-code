# Recipe Keeper — Lesson 14 (Arc C · Test & Ship)

The **app code is unchanged from Lesson 13** apart from `backend/ruff.toml` (tells the
lint step to skip the generated `migrations/`) — this lesson builds the CI pipeline
in **Semaphore's visual Workflow Builder**, which lives in your Semaphore project
and your GitHub connection, not in these files.

The pipeline runs *this project's* checks on every push: `ruff` + `pytest` (backend,
against a Postgres it starts with `sem-service`), `bun run build` + `vitest`
(frontend), and the **Playwright E2E test** — uploading its trace/video/screenshot
as an artifact on failure. Run everything locally exactly as in Lesson 13; the
pipeline runs the same commands on a fresh machine.

The block's **environment variables** (set in the Workflow Builder, not a secret —
throwaway values so the app can start; the tests never touch R2 or Redis):

```
FLASK_APP=main
DATABASE_URL=postgresql://postgres@localhost:5432/postgres
TEST_DATABASE_URL=postgresql://postgres@localhost:5432/postgres
SECRET_KEY=ci-only-not-a-secret
SECURITY_PASSWORD_SALT=ci-only-not-a-secret
R2_ENDPOINT=https://r2.invalid
R2_ACCESS_KEY_ID=ci
R2_SECRET_ACCESS_KEY=ci
R2_BUCKET=ci
R2_PUBLIC_URL=https://r2.invalid
REDIS_URL=redis://localhost:6379/0
```

The job commands are in the lesson (each starts with `checkout`; the backend and
E2E jobs run `sem-version python 3.12` and `sem-service start postgres`).
