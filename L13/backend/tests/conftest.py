import os

import pytest
from flask_security import hash_password

from extensions import db
from main import create_app
from models import user_datastore

# Tests run against a separate database, never your real one. CI can set
# TEST_DATABASE_URL; locally it's the recipes_test database in the Docker Postgres.
TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql://recipes:devpassword@db:5432/recipes_test",
)


@pytest.fixture
def app():
    # The app factory builds a fresh app with the test settings BEFORE anything
    # connects — so the tests can never touch your real data.
    app = create_app({
        "SQLALCHEMY_DATABASE_URI": TEST_DATABASE_URL,
        "TESTING": True,
        "WTF_CSRF_ENABLED": False,  # CSRF is a browser concern; tests skip it
    })
    with app.app_context():
        db.create_all()  # a throwaway test DB, so create_all is fine here
        user_datastore.find_or_create_role(name="admin")
        if not user_datastore.find_user(email="t@example.com"):
            user_datastore.create_user(
                email="t@example.com",
                password=hash_password("password123"),
                roles=["admin"],
            )
        db.session.commit()
    yield app
    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    # Requests run outside the setup app context, each with its own — like in production.
    return app.test_client()


@pytest.fixture
def auth_client(client):
    # Log in once — the session cookie is stored in the test client and sent on
    # every later request, exactly like the browser does. No token to pass around.
    client.post("/login", json={"email": "t@example.com", "password": "password123"})
    return client
