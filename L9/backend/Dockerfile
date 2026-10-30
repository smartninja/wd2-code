FROM python:3.12-slim
WORKDIR /app
# Lets the Celery worker import main.py from inside a task
ENV PYTHONPATH=/app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
