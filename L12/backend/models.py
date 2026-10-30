from flask_security import RoleMixin, SQLAlchemyUserDatastore, UserMixin

from extensions import db

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


user_datastore = SQLAlchemyUserDatastore(db, User, Role)
