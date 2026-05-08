#!/bin/bash

# Production Celery worker deployment script

echo "🔄 Starting SolScore Celery Worker..."

# Install dependencies
pip install -r requirements.txt

# Start Celery worker
celery -A tasks.score_job worker --loglevel=info --concurrency=4