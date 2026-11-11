# Lesson 4 homework — solutions

This folder is the finished Lesson 4 code plus the homework, and it runs the same way as `L04` (see the Run steps in `L04/README.md` and `L04/backend/README.md`).

## Task: file-size limit

Reject any upload over 5 MB and answer `422` when it is too big.

**Solution:** all changes are in `backend/main.py`.

A constant and a small helper next to `ALLOWED`:

```python
# Largest upload we accept: 5 MB, in bytes
MAX_UPLOAD = 5 * 1024 * 1024


def too_big():
    """True if the whole request is over MAX_UPLOAD bytes."""
    return (request.content_length or 0) > MAX_UPLOAD
```

`request.content_length` is the size the client says the whole request has, so the app can refuse before it reads the file. It is `None` when the client sends no size, which the `or 0` turns into "not too big".

The API route checks it first and stops with `422`, the same code it uses for a wrong file type:

```python
def upload_photo(recipe_id):
    recipe = db.get_or_404(Recipe, recipe_id)
    if too_big():
        abort(422)                                   # over 5 MB
    ...
```

The page route checks it too. Like a wrong file type on the page, a file that is too big sends you back to the list with nothing changed:

```python
def upload_photo_page(recipe_id):
    recipe = db.get_or_404(Recipe, recipe_id)
    if too_big():
        return redirect(url_for("recipe_list"))  # too big: back to the list, unchanged
    ...
```

Why not Flask's `MAX_CONTENT_LENGTH` setting: it also rejects big requests, but it answers `413 Request Entity Too Large`, and the homework asks for `422`. On the page it would show an error page instead of returning to the list.

Note that the limit is on the whole request, so the form's other parts count too. A photo of 4.99 MB can be refused by a few bytes. That is fine for a "5 MB, roughly" limit.

## Task: verify a small image succeeds and a big one is refused

**Verify:** start the app as in `L04`, log in as the admin in Bruno (with the `X-CSRF-Token` header, as in the lesson's Verify step 2), and have a recipe to upload to.

1. Make a test file over 5 MB. On macOS or Linux: `head -c 6000000 /dev/urandom > big.jpg`. Any real photo over 5 MB works too. The extension is `.jpg`, so only the size can make it fail.
2. **POST `http://localhost:8000/api/recipes/<id>/photo`**, multipart, file field `photo`, with a normal small `.jpg`. Expected: `200` and an `image_url` starting with your `R2_PUBLIC_URL`.
3. The same request with `big.jpg`. Expected: `422`, and no new object in the R2 bucket.
4. In the browser, logged in, choose `big.jpg` in a recipe's file picker and click **Upload photo**. Expected: the page reloads and the recipe's photo has not changed (no error page, no `413`).

## Task: why user uploads don't go on the app server's disk

**Model answer:** The app runs in a container, and a container is disposable: every redeploy replaces it with a fresh disk, so files saved there are gone. If you run more than one copy of the app, each copy also has its own disk, so a photo saved by one would be missing on the others. Object storage like R2 keeps the files outside the app, so they survive redeploys and every copy of the app sees the same files.

## Files changed compared with L04

- `backend/main.py`: `MAX_UPLOAD`, `too_big()`, and a size check in `upload_photo` (API) and `upload_photo_page` (page).
- `README.md`: this file.
