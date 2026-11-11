# The Flask extensions, created WITHOUT an app. create_app() in main.py attaches
# them to an app with init_app(), so a test can build its own app (with its own
# database) before anything connects.
from flask_cors import CORS
from flask_migrate import Migrate
from flask_security import Security
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CSRFProtect

db = SQLAlchemy()
migrate = Migrate()
security = Security()
csrf = CSRFProtect()
cors = CORS()
