def test_health(client):
    # the test database is up, so the health check's SELECT 1 succeeds
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.get_json() == {"status": "ok"}
