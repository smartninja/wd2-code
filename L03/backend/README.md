# Recipe Keeper — end of Lesson 3

Adds authentication and roles with **Flask-Security-Too**: one **session-cookie**
login guards both the API writes and the page forms, and the `admin` role is
required to delete. Because auth rides on a cookie, writes are **CSRF-protected** —
a readable `XSRF-TOKEN` cookie the client echoes back in an `X-CSRF-Token` header,
and the Jinja forms send it as a hidden `csrf_token` field.

## Run

1. Copy `.env.example` to `.env` (set real random values for the two secrets).
2. `docker compose up`
3. Create the default admin: `docker compose exec api flask create-admin`
   (creates `me@example.com` / `supersecret`).
4. Browser: http://localhost:8000/ — log in at `/login` to add/delete.
5. API: `POST /login` (JSON) to get a session cookie, then send writes with that
   cookie **plus** an `X-CSRF-Token` header (copy the value from the `XSRF-TOKEN`
   cookie). No header → `400` (the CSRF check runs first); header but no
   session → `401`. Only admins see (and may use) Delete.

Starting point for Lesson 4.
