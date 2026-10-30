import io
import json
import os
from datetime import datetime, timezone

from flask_security import hash_password

from extensions import db
from models import Recipe, user_datastore
from storage import s3


def register_commands(app):
    """Attach the `flask ...` CLI commands to the app."""

    @app.cli.command("create-admin")
    def create_admin():
        """Create a default admin user (me@example.com / supersecret)."""
        user_datastore.find_or_create_role(name="admin", description="Administrator")
        if not user_datastore.find_user(email="me@example.com"):
            user_datastore.create_user(
                email="me@example.com",
                password=hash_password("supersecret"),
                roles=["admin"],
            )
        db.session.commit()
        print("admin ready: me@example.com / supersecret")

    @app.cli.command("backup-recipes")
    def backup_recipes():
        """Write all recipes to a timestamped JSON file in R2 (a cron job)."""
        recipes = [{"id": r.id, "name": r.name, "tag": r.tag} for r in Recipe.query.all()]
        data = json.dumps(recipes, indent=2).encode()
        key = f"backups/recipes-{datetime.now(timezone.utc):%Y-%m-%d}.json"
        s3.upload_fileobj(io.BytesIO(data), os.environ["R2_BUCKET"], key)
        print(f"backed up {len(recipes)} recipes to {key}")
