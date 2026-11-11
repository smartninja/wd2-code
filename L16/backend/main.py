import os

import sentry_sdk
from apiflask import APIFlask
from flask_wtf.csrf import generate_csrf

from api import api
from commands import register_commands
from extensions import cors, csrf, db, migrate, security
from models import user_datastore
from pages import pages

# Error tracking in deployed environments (Sentry). Gated on the env var so it
# only runs where a DSN is configured — never in local dev or tests.
if os.environ.get("SENTRY_DSN"):
    sentry_sdk.init(dsn=os.environ["SENTRY_DSN"])


def create_app(test_config=None):
    """The app factory: builds a configured app when called, not on import.

    `flask --app main ...` finds this function by name. Tests call it with
    their own settings (e.g. a test database) before anything connects.
    """
    app = APIFlask(__name__, title="Recipe Keeper API", version="1.0")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
    app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
    app.config["SECURITY_PASSWORD_SALT"] = os.environ["SECURITY_PASSWORD_SALT"]
    # Auth is by session cookie (lesson 3). Because the browser and the React app
    # send that cookie automatically, we add CSRF protection so only your own app
    # can trigger writes; the anti-CSRF token stays valid for the whole session.
    app.config["WTF_CSRF_TIME_LIMIT"] = None
    # Logging in happens before you have a session, so Flask-Security lets its own
    # login endpoint skip the CSRF check (every write after login still needs it).
    app.config["SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS"] = True
    if test_config:
        app.config.update(test_config)  # tests override settings here, before anything connects

    db.init_app(app)
    migrate.init_app(app, db)  # migrations own the schema now (no create_all)
    security.init_app(app, user_datastore)

    # Protect every state-changing route with CSRF, then exempt Flask-Security's own
    # login/logout views (they manage their own). The token is handed to the browser
    # in a readable XSRF-TOKEN cookie that the app echoes back in a header on writes —
    # a malicious cross-site page can't read it, which is what stops CSRF.
    csrf.init_app(app)
    csrf.exempt(app.blueprints["security"])

    # Let the React dev server (a different origin) call the API *with* cookies —
    # supports_credentials is what allows the session cookie to ride along.
    cors.init_app(app, origins=["http://localhost:5173"], supports_credentials=True)

    app.register_blueprint(pages)
    app.register_blueprint(api)
    register_commands(app)

    @app.after_request
    def set_csrf_cookie(response):
        response.set_cookie("XSRF-TOKEN", generate_csrf(), samesite="Lax")
        return response

    @app.get("/health")
    def health():
        """Liveness check for the platform (Render pings this)."""
        return {"status": "ok"}

    return app
