import os

from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]

db = SQLAlchemy(app)


class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    tag = db.Column(db.String)


with app.app_context():
    db.create_all()


@app.route("/")
def recipe_list():
    query = Recipe.query
    # /?tag=breakfast keeps only that tag; with no ?tag= it is None and we show all
    tag = request.args.get("tag")
    if tag:
        query = query.filter_by(tag=tag)
    recipes = query.order_by(Recipe.id).all()
    return render_template("recipes.html", recipes=recipes)
