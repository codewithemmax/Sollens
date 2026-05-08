#!/bin/bash

echo "🚀 Setting up SolScore..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 is required but not installed."; exit 1; }
command -v anchor >/dev/null 2>&1 || { echo "❌ Anchor CLI is required but not installed."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed."; exit 1; }

echo "✅ Prerequisites check passed"

# Setup backend
echo "📦 Setting up backend..."
cd backend
cp .env.example .env
pip install -r requirements.txt
cd ..

# Setup frontend
echo "📦 Setting up frontend..."
cd frontend
cp .env.local.example .env.local
npm install
cd ..

# Build Anchor program
echo "🔨 Building Anchor program..."
anchor build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your Helius API key"
echo "2. Run 'anchor deploy --provider.cluster devnet' to deploy the program"
echo "3. Run 'docker-compose up' to start all services"
echo "4. Visit http://localhost:3000 to use the app"
