def test_list_is_empty_at_first(client):
    resp = client.get("/api/recipes")
    assert resp.status_code == 200
    assert resp.get_json() == []


def test_missing_recipe_is_404(client):
    assert client.get("/api/recipes/9999").status_code == 404


def test_create_requires_auth(client):
    # writes are protected (lesson 3) — no session, no create
    resp = client.post("/api/recipes", json={"name": "X"})
    assert resp.status_code == 401


def test_create_then_list(auth_client):
    # the logged-in client carries the session cookie automatically
    resp = auth_client.post("/api/recipes", json={"name": "Pancakes", "tag": "breakfast"})
    assert resp.status_code == 201
    assert resp.get_json()["name"] == "Pancakes"

    listed = auth_client.get("/api/recipes").get_json()
    assert len(listed) == 1


def test_create_requires_name(auth_client):
    # the RecipeIn schema rejects a missing name with 422
    resp = auth_client.post("/api/recipes", json={})
    assert resp.status_code == 422


def test_update_recipe(auth_client):
    recipe_id = auth_client.post("/api/recipes", json={"name": "Soup"}).get_json()["id"]
    # PUT replaces the whole recipe, and RecipeIn requires name, so send it too
    resp = auth_client.put(f"/api/recipes/{recipe_id}", json={"name": "Soup", "tag": "dinner"})
    assert resp.status_code == 200
    assert resp.get_json()["tag"] == "dinner"


def test_delete_recipe(auth_client):
    # the fixture's test user is an admin, so it passes @roles_required("admin")
    recipe_id = auth_client.post("/api/recipes", json={"name": "Toast"}).get_json()["id"]
    assert auth_client.delete(f"/api/recipes/{recipe_id}").status_code == 204
    assert auth_client.get(f"/api/recipes/{recipe_id}").status_code == 404
