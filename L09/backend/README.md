# Recipe Keeper backend — Arc B/C

The Lesson 6 backend, prepared for the React app (added in **Lesson 9**):

- `flask-cors` **with credentials** — `CORS(app, origins=["http://localhost:5173"],
  supports_credentials=True)` lets the browser app call the API across origins *and*
  send the session cookie.
- a small **`/api/me`** endpoint — the React app calls it on load to learn who's
  logged in (the session cookie survives a refresh).

Auth is unchanged from Lesson 3: one session-cookie login for pages and API, with
CSRF on writes. From **Lesson 11** the backend also carries automated `tests/`.

```bash
cp .env.example .env   # fill in R2_* (incl. R2_PUBLIC_URL)
docker compose up --build
# first run only:
docker compose exec api flask db upgrade
docker compose exec api flask create-admin   # me@example.com / supersecret
```

Interactive API docs: http://localhost:8000/docs
