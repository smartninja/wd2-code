FROM python:3.12-slim
WORKDIR /app
# Lets the Celery worker import main.py from inside a task
ENV PYTHONPATH=/app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
# Production start command (Render). docker compose overrides it locally.
# "main:create_app()" tells gunicorn to call the app factory to get the app.
CMD ["sh", "-c", "flask --app main db upgrade && gunicorn --bind 0.0.0.0:${PORT:-8000} 'main:create_app()'"]
