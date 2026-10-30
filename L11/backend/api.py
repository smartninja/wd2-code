# The JSON REST API, as an APIFlask blueprint. url_prefix="/api" means the
# routes below say "/recipes" and are served at "/api/recipes".
from apiflask import APIBlueprint, Schema
from apiflask.fields import Integer, String
from apiflask.validators import Length
from flask import abort, request
from flask_security import auth_required, current_user, roles_required

from extensions import db
from models import Recipe
from storage import store_photo
from tasks import make_thumbnail

api = APIBlueprint("api", __name__, url_prefix="/api", tag="Recipes")


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


@api.get("/recipes")
@api.output(RecipeOut(many=True))
def list_recipes():
    """List all recipes.

    Returns every saved recipe. Public — no authentication required.
    """
    return Recipe.query.order_by(Recipe.id).all()


@api.get("/recipes/<int:recipe_id>")
@api.output(RecipeOut)
def get_recipe(recipe_id):
    return db.get_or_404(Recipe, recipe_id)


@api.post("/recipes")
@auth_required("session")
@api.input(RecipeIn)
@api.output(RecipeOut, status_code=201)
def create_recipe(json_data):
    recipe = Recipe(
        name=json_data["name"],
        tag=json_data.get("tag"),
        servings=json_data.get("servings"),
    )
    db.session.add(recipe)
    db.session.commit()
    return recipe


@api.put("/recipes/<int:recipe_id>")
@auth_required("session")
@api.input(RecipeIn)
@api.output(RecipeOut)
def update_recipe(recipe_id, json_data):
    recipe = db.get_or_404(Recipe, recipe_id)
    recipe.name = json_data["name"]
    recipe.tag = json_data.get("tag")
    recipe.servings = json_data.get("servings")
    db.session.commit()
    return recipe


@api.delete("/recipes/<int:recipe_id>")
@auth_required("session")
@roles_required("admin")
@api.output({}, status_code=204)
def delete_recipe(recipe_id):
    recipe = db.get_or_404(Recipe, recipe_id)
    db.session.delete(recipe)
    db.session.commit()
    return ""


@api.post("/recipes/<int:recipe_id>/photo")
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


@api.get("/me")
@auth_required("session")
def me():
    """Who is the logged-in user? The React app calls this on load."""
    return {"email": current_user.email,
            "roles": [r.name for r in current_user.roles]}
