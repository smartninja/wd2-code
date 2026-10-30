# The server-rendered pages, as a blueprint. Endpoint names get the blueprint's
# name in front: url_for("pages.recipe_list"), not url_for("recipe_list").
from flask import Blueprint, redirect, render_template, request, url_for
from flask_security import auth_required, roles_required

from extensions import db
from models import Recipe
from storage import store_photo
from tasks import make_thumbnail

pages = Blueprint("pages", __name__)


@pages.route("/")
def recipe_list():
    recipes = Recipe.query.order_by(Recipe.id).all()
    return render_template("recipes.html", recipes=recipes)


@pages.post("/recipes")
@auth_required("session")
def add_recipe_page():
    servings = request.form.get("servings")
    db.session.add(Recipe(
        name=request.form["name"],
        tag=request.form.get("tag"),
        servings=int(servings) if servings else None,
    ))
    db.session.commit()
    return redirect(url_for("pages.recipe_list"))


@pages.post("/recipes/<int:recipe_id>/delete")
@auth_required("session")
@roles_required("admin")
def delete_recipe_page(recipe_id):
    recipe = db.get_or_404(Recipe, recipe_id)
    db.session.delete(recipe)
    db.session.commit()
    return redirect(url_for("pages.recipe_list"))


@pages.post("/recipes/<int:recipe_id>/photo")
@auth_required("session")
def upload_photo_page(recipe_id):
    recipe = db.get_or_404(Recipe, recipe_id)
    url = store_photo(request.files.get("photo"))
    if url:
        recipe.image_url = url
        db.session.commit()
        make_thumbnail.delay(recipe.id)
    return redirect(url_for("pages.recipe_list"))
