# Recipe Keeper — end of Lesson 2

Server-rendered Flask + Jinja app **plus a REST API**, built with APIFlask so each
endpoint is described by a schema (validation + auto-docs for free).

## Run

1. Copy `.env.example` to `.env`.
2. `docker compose up`
3. Open http://localhost:8000/ — add and delete recipes in the browser.
4. Interactive API docs: http://localhost:8000/docs

The JSON API lives under `/api/recipes`. This is the starting point for Lesson 3.
