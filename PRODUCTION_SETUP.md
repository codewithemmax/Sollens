# SolScore Production Deployment Guide

## Prerequisites

1. **Supabase Account**: Create project at https://supabase.com
2. **Upstash Redis**: Create Redis instance at https://upstash.com
3. **Helius API**: Get production API key from https://helius.xyz
4. **Deployment Platform**: Vercel, Railway, or similar

## Step 1: Setup Supabase Database

1. Create new Supabase project
2. Go to Settings > Database
3. Copy connection string: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`
4. Update `DATABASE_URL` in your environment

## Step 2: Setup Redis (Upstash)

1. Create Redis database at https://upstash.com
2. Copy Redis URL: `rediss://default:[PASSWORD]@[ENDPOINT]:6380`
3. Update `REDIS_URL` in your environment

## Step 3: Deploy Backend

### Option A: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add --database postgresql
railway deploy
```

### Option B: Manual VPS
```bash
# Copy backend files to server
scp -r backend/ user@server:/app/

# SSH into server
ssh user@server

# Setup environment
cd /app
cp .env.production .env
# Edit .env with your actual credentials

# Install dependencies and run
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Step 4: Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
cp .env.production .env.local
# Edit .env.local with your backend URL
vercel --prod
```

## Step 5: Deploy Solana Program

```bash
# Build and deploy to mainnet
anchor build
anchor deploy --provider.cluster mainnet

# Update frontend with new Program ID
```

## Step 6: Setup Celery Worker

Deploy Celery worker separately (same server or different):

```bash
# Copy worker deployment script
chmod +x deploy-worker.sh
./deploy-worker.sh
```

## Environment Variables Checklist

### Backend (.env)
- [ ] `HELIUS_API_KEY` - Production Helius API key
- [ ] `DATABASE_URL` - Supabase connection string
- [ ] `REDIS_URL` - Upstash Redis URL
- [ ] `SOLANA_RPC_URL` - Mainnet RPC URL
- [ ] `AUTHORITY_PRIVATE_KEY` - Production authority key

### Frontend (.env.local)
- [ ] `NEXT_PUBLIC_SOLANA_RPC_URL` - Mainnet RPC URL
- [ ] `NEXT_PUBLIC_API_URL` - Deployed backend URL
- [ ] `NEXT_PUBLIC_PROGRAM_ID` - Deployed program ID

## Testing Production Setup

1. **Database Connection**: Test with `alembic upgrade head`
2. **Redis Connection**: Test Celery worker startup
3. **API Endpoints**: Test `/health` and `/api/score` endpoints
4. **Frontend**: Test wallet connection and score requests

## Monitoring & Maintenance

- Monitor database connections in Supabase dashboard
- Monitor Redis usage in Upstash dashboard
- Set up error tracking (Sentry recommended)
- Monitor API response times and errors