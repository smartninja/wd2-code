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
