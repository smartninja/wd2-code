import io
import os

from botocore.exceptions import BotoCoreError, ClientError
from celery import Celery
from PIL import Image

celery_app = Celery("recipe_keeper", broker=os.environ["REDIS_URL"])


@celery_app.task(bind=True, max_retries=3, default_retry_delay=10)
def make_thumbnail(self, recipe_id):
    # Imported here (not at module top) to avoid a circular import: main imports
    # the blueprints, and the blueprints import this task.
    from extensions import db
    from main import create_app
    from models import Recipe
    from storage import s3

    app = create_app()  # the worker has no app of its own, so it builds one
    with app.app_context():
        recipe = db.session.get(Recipe, recipe_id)
        if not recipe or not recipe.image_url:
            return
        try:
            key = recipe.image_url.rsplit("/", 1)[1]

            buf = io.BytesIO()
            s3.download_fileobj(os.environ["R2_BUCKET"], key, buf)
            buf.seek(0)

            img = Image.open(buf)
            img.thumbnail((200, 200))
            out = io.BytesIO()
            img.save(out, format="PNG")
            out.seek(0)

            thumb_key = f"thumb_{key.rsplit('.', 1)[0]}.png"
            s3.upload_fileobj(out, os.environ["R2_BUCKET"], thumb_key)
            recipe.thumb_url = f"{os.environ['R2_PUBLIC_URL']}/{thumb_key}"
            db.session.commit()
        except (BotoCoreError, ClientError) as exc:
            # R2 had a hiccup: try again in a bit instead of losing the job
            raise self.retry(exc=exc) from exc
