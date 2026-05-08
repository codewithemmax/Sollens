# SolScore Deployment Guide

## Prerequisites

- Solana CLI configured with a funded wallet
- Helius API key
- Railway/Render account (for backend)
- Vercel account (for frontend)

## 1. Deploy Anchor Program to Mainnet

```bash
# Build the program
anchor build

# Update Anchor.toml with mainnet cluster
# Change: cluster = "Mainnet"

# Deploy to mainnet
anchor deploy --provider.cluster mainnet

# Note the program ID and update it in:
# - Anchor.toml
# - frontend/lib/anchor.ts
```

## 2. Setup Database

**Option A: Railway**
```bash
# Create PostgreSQL database on Railway
# Copy connection string
```

**Option B: Managed PostgreSQL**
```bash
# Use AWS RDS, DigitalOcean, or similar
# Ensure SSL is enabled
```

## 3. Setup Redis

**Option A: Railway**
```bash
# Add Redis service on Railway
# Copy connection string
```

**Option B: Upstash**
```bash
# Create Redis database on Upstash
# Copy connection string
```

## 4. Deploy Backend

**Railway:**
```bash
# Connect GitHub repo to Railway
# Add environment variables:
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
HELIUS_API_KEY=your_key
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
AUTHORITY_PRIVATE_KEY=your_key

# Railway will auto-deploy from Dockerfile
```

**Render:**
```bash
# Create new Web Service
# Connect GitHub repo
# Set build command: pip install -r requirements.txt
# Set start command: uvicorn main:app --host 0.0.0.0 --port $PORT
# Add environment variables (same as above)
```

## 5. Deploy Celery Worker

**Railway:**
```bash
# Create new service from same repo
# Set start command: celery -A tasks.score_job worker --loglevel=info
# Use same environment variables
```

## 6. Deploy Frontend

**Vercel:**
```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard:
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## 7. Setup Helius Webhooks

```bash
# In Helius dashboard:
# 1. Create webhook
# 2. Set URL: https://your-backend.railway.app/api/webhook/helius
# 3. Select transaction types to monitor
# 4. Add wallet addresses to track
```

## 8. Database Migrations

```bash
cd backend

# Run migrations
alembic upgrade head
```

## 9. Verify Deployment

```bash
# Test backend health
curl https://your-backend.railway.app/health

# Test frontend
# Visit https://your-app.vercel.app
# Connect wallet and request score
```

## Environment Variables Summary

**Backend:**
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `HELIUS_API_KEY`: Helius API key
- `SOLANA_RPC_URL`: Solana RPC endpoint
- `AUTHORITY_PRIVATE_KEY`: Authority keypair for updates

**Frontend:**
- `NEXT_PUBLIC_SOLANA_RPC_URL`: Solana RPC endpoint
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Monitoring

**Backend Logs:**
```bash
# Railway: View in dashboard
# Render: View in dashboard
```

**Celery Monitoring:**
```bash
# Install Flower
pip install flower

# Run Flower
celery -A tasks.score_job flower
```

## Security Checklist

- [ ] Enable CORS only for your frontend domain
- [ ] Use HTTPS for all endpoints
- [ ] Rotate API keys regularly
- [ ] Enable rate limiting on API endpoints
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable database backups

## Scaling

**Backend:**
- Increase Railway/Render instance size
- Add horizontal scaling with load balancer

**Celery:**
- Add more worker instances
- Use Redis as message broker for better performance

**Database:**
- Enable connection pooling
- Add read replicas for queries
- Implement caching layer

## Troubleshooting

**Program deployment fails:**
- Ensure wallet has enough SOL for deployment
- Check program size limits
- Verify Anchor version compatibility

**Backend can't connect to database:**
- Check DATABASE_URL format
- Verify SSL settings
- Check firewall rules

**Celery tasks not processing:**
- Verify Redis connection
- Check worker logs
- Ensure REDIS_URL is correct

**Frontend can't connect to backend:**
- Verify CORS settings
- Check API_URL environment variable
- Test backend health endpoint
