# Lesson 15 homework — solutions

This is the finished code of lesson 15 plus the homework, and it runs exactly like `L15` (see the run instructions in `L15/README.md`: locally with `docker compose up` in `backend/` and `bun run dev` in `frontend/`, and on Render through the pipeline).

## Task: the health check also checks the database

Asked: make `/health` confirm the database connects, with `db.session.execute(db.text("SELECT 1"))`, and watch Render keep the service healthy.

**Solution:** in `backend/main.py`, the `health` route runs the query first, and one new import at the top:

```python
from sqlalchemy.exc import SQLAlchemyError
...
    @app.get("/health")
    def health():
        """Health check for the platform (Render pings this): app and database up."""
        try:
            db.session.execute(db.text("SELECT 1"))  # the smallest query there is
        except SQLAlchemyError:  # any database error, e.g. it can't connect
            # No database, no working app: answer 503 so Render sees it as unhealthy,
            # with a short JSON body instead of a 500 error page.
            return {"status": "error"}, 503
        return {"status": "ok"}
```

- `SELECT 1` asks the database for the number 1. It reads no table, so it's as fast as a query can be, which matters for a URL Render calls every few seconds. If it comes back, the connection works.
- **Why a 503, and not just let the error happen?** Without the `try`, a dead database raises an error and Flask answers `500`, which Render would also count as unhealthy. So the choice is about the answer, not the outcome: `503 Service Unavailable` is the status code that means "I'm up, but I can't serve right now", and the body stays a short `{"status": "error"}` instead of an error page. It's still only a few lines.
- `SQLAlchemyError` is the parent of every error SQLAlchemy raises, including "can't connect". Catching that, and not every possible `Exception`, is what Ruff's `BLE001` rule asks for, so the lint step stays green. `sqlalchemy` comes with `flask-sqlalchemy`, so `requirements.txt` doesn't change.
- What this means on Render: while a new deploy can't reach its database, it never goes Live and the old version keeps running. If the database goes away later, Render marks the backend unhealthy and restarts it. That's right for this app, because without its database it can't show or save a single recipe.

**Verify:**

- Locally, with `docker compose up` running in `backend/`: open `http://localhost:8000/health`. Expected: `{"status": "ok"}`.
- Stop only the database: `docker compose stop db`, then `curl -i http://localhost:8000/health`. Expected, after a moment: `HTTP/1.1 503 SERVICE UNAVAILABLE` and `{"status": "error"}`. Start it again with `docker compose start db`, and `/health` is `{"status": "ok"}` again.
- On Render: commit and push. When the pipeline's "Deploy staging" block has run, open the backend service. Its Events show the deploy going Live, the service stays **Live**, and `https://recipe-backend-staging….onrender.com/health` shows `{"status": "ok"}`. That green status now also means the backend reaches its Postgres.

## Task: a backend test for `/health`

Asked: a test for `/health` with lesson 11's `client` fixture, and see it run in the pipeline.

**Solution:** a new file, `backend/tests/test_health.py`:

```python
def test_health(client):
    # the test database is up, so the health check's SELECT 1 succeeds
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.get_json() == {"status": "ok"}
```

It uses `client`, not `auth_client`, because the health check needs no login: Render calls it without one. pytest finds the file on its own, because `pytest.ini` says `testpaths = tests` and the name starts with `test_`.

**Verify:**

- Locally: `docker compose exec api pytest` in `backend/`. Expected: `6 passed`, with `tests/test_health.py .` in the output.
- Ruff: `uvx ruff@0.17.3 check .` (or the container command from lesson 14) prints `All checks passed!`.
- Push, and open the "Backend lint & tests" job in Semaphore. Its log shows `All checks passed!` from Ruff, then `tests/test_health.py .` and `6 passed` from pytest, and the pipeline goes on to "Deploy staging".

## Task: why the proxy, and why auto-deploy is off

**Model answer (proxy):** on Render the frontend and backend get two names under `onrender.com`, which is on the Public Suffix List, so the browser treats them as two unrelated sites: the session cookie isn't sent with the API calls and the React code can't read the `XSRF-TOKEN` cookie. With the rewrites, the browser only ever talks to the frontend's name and Render forwards `/api/*`, `/login` and `/logout` behind the scenes, so both cookies are first-party again, exactly like on `localhost`.

**Model answer (auto-deploy):** with auto-deploy on, Render deploys every push at the same moment Semaphore starts testing it, so a commit with a failing test would go live anyway. With it off, the only way to deploy is the pipeline's deploy hooks, which run only after every check is green, so the pipeline really is the gate.

## Files changed compared with L15

- `backend/main.py` (the `SQLAlchemyError` import and the database check in `/health`)
- `backend/tests/test_health.py` (new)
- `README.md` (this file, replacing the lesson README)
