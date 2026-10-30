# WD2 Curriculum

Source code for the WD2 (Web Development 2) curriculum. Over 15 lessons, you build
**Recipe Keeper**, a full-stack recipe app, from a first server-rendered page through
to a tested app deployed to production.

## Structure

Each `L<n>/` directory is a self-contained snapshot of the project at the end of that
lesson, with the same shape throughout:

- `backend/` — the Flask + PostgreSQL app, run with Docker
- `frontend/` — the React + TypeScript app (empty until Lesson 7)
- `README.md` — what the lesson adds and how to run it

To work on a lesson, go to its directory and follow its `README.md`.

## Lessons

### Arc A · Server-Rendered

| Lesson | Topic |
| ------ | ----- |
| [L1](L1/) | Docker, Flask and PostgreSQL, with a first server-rendered Jinja page |
| [L2](L2/) | REST API with APIFlask and generated Swagger docs |
| [L3](L3/) | Session-cookie authentication and authorization, with CSRF protection |
| [L4](L4/) | Photo upload to Cloudflare R2 |
| [L5](L5/) | Background jobs with Celery and Redis |
| [L6](L6/) | Database migrations with Flask-Migrate |

### Arc B · Single-Page App

| Lesson | Topic |
| ------ | ----- |
| [L7](L7/) | React + TypeScript scaffold with Bun, Vite and Tailwind |
| [L8](L8/) | React fundamentals and forms with TanStack Form |
| [L9](L9/) | Connecting to the backend with TanStack Query |
| [L10](L10/) | Multiple screens with TanStack Router |

### Arc C · Test & Ship

| Lesson | Topic |
| ------ | ----- |
| [L11](L11/) | Backend testing with pytest, and splitting the app into blueprints |
| [L12](L12/) | Frontend testing with Vitest and React Testing Library |
| [L13](L13/) | End-to-end testing with Playwright |
| [L14](L14/) | CI pipeline with Semaphore |
| [L15](L15/) | Deployment to Render, staging environment and observability |
