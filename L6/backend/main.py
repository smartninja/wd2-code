import io
import json
import os
import uuid
from datetime import datetime, timezone

import boto3
from apiflask import APIFlask, Schema
from apiflask.fields import Integer, String
from apiflask.validators import Length
from flask import abort, redirect, render_template, request, url_for
from flask_migrate import Migrate
from flask_security import (
    RoleMixin,
    Security,
    SQLAlchemyUserDatastore,
    UserMixin,
    auth_required,
    hash_password,
    roles_required,
)
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CSRFProtect
from flask_wtf.csrf import generate_csrf

from tasks import make_thumbnail

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

db = SQLAlchemy(app)
migrate = Migrate(app, db)  # migrations own the schema now (no create_all)

s3 = boto3.client(
    "s3",
    endpoint_url=os.environ["R2_ENDPOINT"],
    aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
)

roles_users = db.Table(
    "roles_users",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
    db.Column("role_id", db.Integer, db.ForeignKey("role.id")),
)


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    description = db.Column(db.String)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    active = db.Column(db.Boolean, default=True)
    fs_uniquifier = db.Column(db.String, unique=True)
    roles = db.relationship("Role", secondary=roles_users)


class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    tag = db.Column(db.String)
    image_url = db.Column(db.String)
    thumb_url = db.Column(db.String)
    servings = db.Column(db.Integer)


class RecipeIn(Schema):
    name = String(required=True, validate=Length(min=1))
    tag = String()
    servings = Integer(required=False, allow_none=True)


class RecipeOut(Schema):
    id = Integer()
    name = String()
    tag = String()
    image_url = String()
    thumb_url = String()
    servings = Integer()


user_datastore = SQLAlchemyUserDatastore(db, User, Role)
app.security = Security(app, user_datastore)

# Protect every state-changing route with CSRF, then exempt Flask-Security's own
# login/logout views (they manage their own). The token is handed to the browser
# in a readable XSRF-TOKEN cookie that the app echoes back in a header on writes —
# a malicious cross-site page can't read it, which is what stops CSRF.
csrf = CSRFProtect(app)
csrf.exempt(app.blueprints["security"])


@app.after_request
def set_csrf_cookie(response):
    response.set_cookie("XSRF-TOKEN", generate_csrf(), samesite="Lax")
    return response


ALLOWED = {"png", "jpg", "jpeg", "webp"}


def is_allowed(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED


def store_photo(file):
    if not file or file.filename == "" or not is_allowed(file.filename):
        return None
    ext = file.filename.rsplit(".", 1)[1].lower()
    key = f"{uuid.uuid4()}.{ext}"
    s3.upload_fileobj(file, os.environ["R2_BUCKET"], key)
    return f"{os.environ['R2_PUBLIC_URL']}/{key}"


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


# ---- Server-rendered pages ----

@app.route("/")
def recipe_list():
    recipes = Recipe.query.order_by(Recipe.id).all()
    return render_template("recipes.html", recipes=recipes)


@app.post("/recipes")
@auth_required("session")
def add_recipe_page():
    servings = request.form.get("servings")
    db.session.add(Recipe(
        name=request.form["name"],
        tag=request.form.get("tag"),
        servings=int(servings) if servings else None,
    ))
    db.session.commit()
    return redirect(url_for("recipe_list"))


@app.post("/recipes/<int:recipe_id>/delete")
@auth_required("session")
@roles_required("admin")
def delete_recipe_page(recipe_id):
    recipe = db.get_or_404(Recipe, recipe_id)
    db.session.delete(recipe)
    db.session.commit()
    return redirect(url_for("recipe_list"))


@app.post("/recipes/<int:recipe_id>/photo")
@auth_required("session")
def upload_photo_page(recipe_id):
    recipe = db.get_or_404(Recipe, recipe_id)
    url = store_photo(request.files.get("photo"))
    if url:
        recipe.image_url = url
        db.session.commit()
        make_thumbnail.delay(recipe.id)
    return redirect(url_for("recipe_list"))


# ---- JSON REST API ----

@app.get("/api/recipes")
@app.output(RecipeOut(many=True))
def list_recipes():
    return Recipe.query.order_by(Recipe.id).all()


@app.get("/api/recipes/<int:recipe_id>")
@app.output(RecipeOut)
def get_recipe(recipe_id):
    return db.get_or_404(Recipe, recipe_id)


@app.post("/api/recipes")
@auth_required("session")
@app.input(RecipeIn)
@app.output(RecipeOut, status_code=201)
def create_recipe(json_data):
    recipe = Recipe(
        name=json_data["name"],
        tag=json_data.get("tag"),
        servings=json_data.get("servings"),
    )
    db.session.add(recipe)
    db.session.commit()
    return recipe


@app.put("/api/recipes/<int:recipe_id>")
@auth_required("session")
@app.input(RecipeIn)
@app.output(RecipeOut)
def update_recipe(recipe_id, json_data):
    recipe = db.get_or_404(Recipe, recipe_id)
    recipe.name = json_data["name"]
    recipe.tag = json_data.get("tag")
    recipe.servings = json_data.get("servings")
    db.session.commit()
    return recipe


@app.delete("/api/recipes/<int:recipe_id>")
@auth_required("session")
@roles_required("admin")
@app.output({}, status_code=204)
def delete_recipe(recipe_id):
    recipe = db.get_or_404(Recipe, recipe_id)
    db.session.delete(recipe)
    db.session.commit()
    return ""


@app.post("/api/recipes/<int:recipe_id>/photo")
@auth_required("session")
def upload_photo(recipe_id):
    recipe = db.get_or_404(Recipe, recipe_id)
    if "photo" not in request.files:
        abort(422)
    url = store_photo(request.files["photo"])
    if not url:
        abort(422)
    recipe.image_url = url
    db.session.commit()
    make_thumbnail.delay(recipe.id)
    return {"image_url": recipe.image_url}
