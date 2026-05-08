#!/bin/bash

# Production deployment script for SolScore backend

echo "🚀 Starting SolScore Backend Production Deployment..."

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Run database migrations
echo "🗄️ Running database migrations..."
alembic upgrade head

# Start the application
echo "🌟 Starting FastAPI server..."
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4