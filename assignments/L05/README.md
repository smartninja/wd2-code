# Lesson 5 homework — solutions

This folder is the finished Lesson 5 code plus the homework, and it runs the same way as `L05` (see the Run steps in `L05/README.md` and `L05/backend/README.md`).

## Task: delete the thumbnail in a Celery task

Add a task that deletes a recipe's thumbnail from R2 when the recipe is deleted, and enqueue it from both delete routes.

**Solution:**

`backend/tasks.py` gets a second task, built like `make_thumbnail`, with the same retries:

```python
@celery_app.task(bind=True, max_retries=3, default_retry_delay=10)
def delete_thumbnail(self, key):
    # Gets the R2 key, not the recipe id: by the time this runs, the recipe row
    # has already been deleted, so there'd be nothing to look up.
    from main import s3

    try:
        s3.delete_object(Bucket=os.environ["R2_BUCKET"], Key=key)
    except (BotoCoreError, ClientError) as exc:
        raise self.retry(exc=exc) from exc
```

It only needs the `s3` client, not the database, because the key is all it has to know.

`backend/main.py` imports it (`from tasks import delete_thumbnail, make_thumbnail`) and enqueues it in both delete routes, the page one (`delete_recipe_page`) and the API one (`delete_recipe`):

```python
    recipe = db.get_or_404(Recipe, recipe_id)
    thumb_url = recipe.thumb_url  # read it now: after the commit the row is gone
    db.session.delete(recipe)
    db.session.commit()
    if thumb_url:
        # The task gets the key (the URL's last part, thumb_<uuid>.png), not the id
        delete_thumbnail.delay(thumb_url.rsplit("/", 1)[1])
```

Three details:

- The URL is read before the delete, because after the commit the recipe object can no longer be loaded.
- The job is queued after the commit, so if the delete fails, the thumbnail stays.
- A recipe without a photo has no `thumb_url`, so nothing is queued.

The key comes from the URL the same way `make_thumbnail` gets the photo's key: `thumb_url` is `R2_PUBLIC_URL/thumb_<uuid>.png`, and the key is the part after the last `/`. Only the thumbnail is deleted, as the homework asks. The original photo stays in the bucket.

## Task: verify the thumbnail disappears

**Verify:**

1. Start the stack as in `L05`. If it was already running, restart the worker so it loads the new task: `docker compose restart worker`. (The `api` container reloads on its own because of `--debug`; Celery does not.)
2. In the worker logs, does the `[tasks]` list now show both `. tasks.delete_thumbnail` and `. tasks.make_thumbnail`?
3. Log in as the admin, add a recipe and upload a photo. Wait for the worker to log `Task tasks.make_thumbnail[...] succeeded`. In the R2 dashboard, is there a `thumb_<uuid>.png` object?
4. Delete the recipe on the page. The worker should log `Task tasks.delete_thumbnail[...] received` and then `succeeded`. Refresh the bucket in the R2 dashboard: the `thumb_<uuid>.png` object should be gone. The original `<uuid>.jpg` is still there.
5. Repeat steps 3 and 4 with the API: **DELETE `/api/recipes/<id>`** in Bruno. Expected: `204`, then the same worker log lines and the thumbnail gone.
6. Delete a recipe that never had a photo. Expected: the delete works and the worker logs nothing, because no job is queued.

## Task: why the backup is a cron job but the thumbnail is a worker

**Model answer:** The backup runs on a clock and doesn't react to any user, so it's a cron job. The thumbnail reacts to an event (this upload, or this delete) and must happen right away, with a retry if R2 has a hiccup, so it's a worker.

## Files changed compared with L05

- `backend/tasks.py`: new `delete_thumbnail(key)` task.
- `backend/main.py`: imports `delete_thumbnail` and enqueues it from `delete_recipe_page` and `delete_recipe` when the recipe has a `thumb_url`.
- `README.md`: this file.
