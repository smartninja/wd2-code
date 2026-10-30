import os
import uuid

import boto3

s3 = boto3.client(
    "s3",
    endpoint_url=os.environ["R2_ENDPOINT"],
    aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
)

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
