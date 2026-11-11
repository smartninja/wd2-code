# Recipe Keeper backend — carried forward (Arc B, Lessons 7–8)

This is the **finished Arc A backend from Lesson 6, unchanged** (session-cookie auth
with CSRF, migrations, R2, Celery). Arc B Lessons 7–8 build the React frontend
against *sample data*, so the backend isn't called yet — it's here so the monorepo
stays whole and you can keep it running if you like.

It gains two things in **Lesson 9**: `flask-cors` (with credentials, so the browser
app on `:5173` may call the API on `:8000` with its session cookie) and a small
`/api/me` endpoint. Run it exactly as at the end of Lesson 6:

```bash
cp .env.example .env        # fill in R2_* (incl. R2_PUBLIC_URL)
docker compose up
# first run only:
docker compose exec api flask db upgrade
docker compose exec api flask create-admin   # me@example.com / supersecret
```
