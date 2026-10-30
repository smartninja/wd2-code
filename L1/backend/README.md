# Recipe Keeper — end of Lesson 1

A Flask + Jinja app on PostgreSQL, all in Docker, serving one server-rendered page
that lists recipes from the database. Configuration (the DB URL) comes from the
environment, with live reload for edits.

## Run

1. Copy `.env.example` to `.env`.
2. `docker compose up`
3. Open http://localhost:8000/ — you'll see "No recipes yet."
4. Add a row to see it appear:
   ```bash
   docker compose exec db psql -U recipes -d recipes -c \
     "INSERT INTO recipe (name, tag) VALUES ('Pancakes', 'breakfast');"
   ```

This is the starting point for Lesson 2.
