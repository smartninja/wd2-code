# Lesson 2 homework — solutions

This folder is the finished code of lesson 2 plus the homework, and it runs the same way as `L2` (see the run instructions in `L2/README.md`: `cd backend`, `cp .env.example .env`, `docker compose up`).

## Task: a `GET /api/recipes?tag=…` filter

Asked: `GET /api/recipes?tag=breakfast` returns only the recipes with that tag.

**Solution:** one file changed, `backend/main.py`. Only the body of `list_recipes` changes; `request` was already imported for the page routes.

```python
@app.get("/api/recipes")
@app.output(RecipeOut(many=True))
def list_recipes():
    query = Recipe.query
    # ?tag=breakfast keeps only that tag; without it, get() returns None and we
    # return every recipe. An unknown tag simply matches nothing: [] with a 200.
    tag = request.args.get("tag")
    if tag:
        query = query.filter_by(tag=tag)
    return query.order_by(Recipe.id).all()
```

The query is built in steps: start with all recipes, add `filter_by(tag=...)` only when a tag was given, and sort by `id` at the end in both cases, so the order stays the same as before. `@app.output(RecipeOut(many=True))` turns whatever list comes back, including an empty one, into JSON.

**Verify:** see the next task.

## Task: verify the filter

Asked: a tag that exists, a tag that doesn't (empty list, still `200`), and no tag at all (all recipes).

**Verify:** with the stack running, create a few recipes first (in Bruno with **02 Create recipe**, or from a terminal):

```bash
curl -X POST localhost:8000/api/recipes -H "Content-Type: application/json" -d '{"name": "Omelette", "tag": "breakfast"}'
curl -X POST localhost:8000/api/recipes -H "Content-Type: application/json" -d '{"name": "Tomato soup", "tag": "dinner"}'
curl -X POST localhost:8000/api/recipes -H "Content-Type: application/json" -d '{"name": "Pancakes", "tag": "breakfast"}'
```

Then send three GETs (in Bruno, copy **01 List recipes** and add `?tag=…` to the URL):

| Request | Expected |
| --- | --- |
| `curl -i "localhost:8000/api/recipes?tag=breakfast"` | `200`, only Omelette and Pancakes, in `id` order |
| `curl -i "localhost:8000/api/recipes?tag=lunch"` | `200` with the body `[]` |
| `curl -i localhost:8000/api/recipes` | `200`, all three recipes |

An unknown tag is not an error: the list exists, it is just empty, so `200` with `[]` is the right answer (a `404` is for one resource that doesn't exist, like `/api/recipes/999`).

## Task: why `POST` returns `201` but `DELETE` returns `204`

**Model answer:** `201 Created` says a new resource was made, and the response body carries it, with its new `id`. `204 No Content` says the delete worked and there is nothing left to send back, so the body is empty.

## Files changed compared with L2

- `backend/main.py` (the `?tag=` filter in `list_recipes`)
- `README.md` (this file)
