# Recipe Keeper — end of Lesson 4

Adds photo upload. Files are validated, renamed with a random key, and stored in an
**S3-compatible bucket** (Cloudflare R2) — not on the container disk, so they survive
redeploys. Photos show on the page and can be uploaded via the browser or the API.

## Run

1. Copy `.env.example` to `.env`.
2. Create a free Cloudflare R2 bucket, turn on its public `r2.dev` URL and create an
   access key; fill the `R2_*` values in `.env` (`R2_PUBLIC_URL` is the `r2.dev` URL).
3. `docker compose up --build`.
4. `docker compose exec api flask create-admin`, log in at `/login`, upload a photo.

Starting point for Lesson 5.
