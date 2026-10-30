import os

from apiflask import APIFlask, Schema
from apiflask.fields import Integer, String
from apiflask.validators import Length
from flask import redirect, render_template, request, url_for
from flask_sqlalchemy import SQLAlchemy

app = APIFlask(__name__, title="Recipe Keeper API", version="1.0")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]

db = SQLAlchemy(app)


class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    tag = db.Column(db.String)


class RecipeIn(Schema):
    name = String(required=True, validate=Length(min=1))
    tag = String()


class RecipeOut(Schema):
    id = Integer()
    name = String()
    tag = String()


with app.app_context():
    db.create_all()


# ---- Server-rendered pages (for people) ----

@app.route("/")
def recipe_list():
    recipes = Recipe.query.order_by(Recipe.id).all()
    return render_template("recipes.html", recipes=recipes)


@app.post("/recipes")
def add_recipe_page():
    db.session.add(Recipe(name=request.form["name"], tag=request.form.get("tag")))
    db.session.commit()
    return redirect(url_for("recipe_list"))


@app.post("/recipes/<int:recipe_id>/delete")
def delete_recipe_page(recipe_id):
    recipe = db.get_or_404(Recipe, recipe_id)
    db.session.delete(recipe)
    db.session.commit()
    return redirect(url_for("recipe_list"))


# ---- JSON REST API (for programs) ----

@app.get("/api/recipes")
@app.output(RecipeOut(many=True))
def list_recipes():
    return Recipe.query.order_by(Recipe.id).all()


@app.get("/api/recipes/<int:recipe_id>")
@app.output(RecipeOut)
def get_recipe(recipe_id):
    return db.get_or_404(Recipe, recipe_id)


@app.post("/api/recipes")
@app.input(RecipeIn)
@app.output(RecipeOut, status_code=201)
def create_recipe(json_data):
    recipe = Recipe(name=json_data["name"], tag=json_data.get("tag"))
    db.session.add(recipe)
    db.session.commit()
    return recipe


@app.put("/api/recipes/<int:recipe_id>")
@app.input(RecipeIn)
@app.output(RecipeOut)
def update_recipe(recipe_id, json_data):
    recipe = db.get_or_404(Recipe, recipe_id)
    recipe.name = json_data["name"]
    recipe.tag = json_data.get("tag")
    db.session.commit()
    return recipe


@app.delete("/api/recipes/<int:recipe_id>")
@app.output({}, status_code=204)
def delete_recipe(recipe_id):
    recipe = db.get_or_404(Recipe, recipe_id)
    db.session.delete(recipe)
    db.session.commit()
    return ""
