# SolScore Quick Reference Guide

## 🚀 Getting Started (5 Minutes)

```bash
# 1. Install dependencies
cd backend && pip install -r requirements.txt && cd ..
cd frontend && npm install && cd ..

# 2. Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
# Edit backend/.env and add your HELIUS_API_KEY

# 3. Start services
docker-compose up -d postgres redis
cd backend && uvicorn main:app --reload &
cd backend && celery -A tasks.score_job worker --loglevel=info &
cd frontend && npm run dev &

# 4. Build Anchor
anchor build
```

## 📁 Project Structure

```
solscore/
├── programs/solscore/          # Anchor smart contract (Rust)
├── backend/                    # FastAPI backend (Python)
├── frontend/                   # Next.js frontend (TypeScript)
├── tests/                      # Test files
└── docker-compose.yml          # Local dev environment
```

## 🔑 Key Files

### Smart Contract
- `programs/solscore/src/lib.rs` - Main program entry
- `programs/solscore/src/state/score_account.rs` - Account structure
- `programs/solscore/src/instructions/*.rs` - Program instructions

### Backend
- `backend/main.py` - FastAPI app
- `backend/scorer/engine.py` - Scoring algorithm
- `backend/api/routes/score.py` - Score endpoints
- `backend/tasks/score_job.py` - Celery tasks

### Frontend
- `frontend/app/page.tsx` - Landing page
- `frontend/app/dashboard/page.tsx` - User dashboard
- `frontend/app/lender/page.tsx` - Lender portal
- `frontend/components/*.tsx` - Reusable components

## 🛠️ Common Commands

### Anchor
```bash
anchor build                    # Build program
anchor test                     # Run tests
anchor deploy --provider.cluster devnet  # Deploy to devnet
anchor idl init <PROGRAM_ID>    # Initialize IDL
```

### Backend
```bash
uvicorn main:app --reload       # Start dev server
celery -A tasks.score_job worker  # Start worker
pytest tests/                   # Run tests
alembic upgrade head            # Run migrations
```

### Frontend
```bash
npm run dev                     # Start dev server
npm run build                   # Build for production
npm run start                   # Start production server
```

### Docker
```bash
docker-compose up               # Start all services
docker-compose up -d            # Start in background
docker-compose down             # Stop all services
docker-compose logs -f backend  # View backend logs
```

## 🔌 API Endpoints

### POST /api/score
Request score computation
```json
{
  "wallet": "wallet_address",
  "signature": "hex_signature",
  "message": "Request SolScore for {wallet}"
}
```

### GET /api/score/{wallet}
Get computed score

### GET /api/score/task/{task_id}
Check task status

### POST /api/webhook/helius
Helius webhook handler

## 📊 Scoring Factors

| Factor | Weight | Max | Description |
|--------|--------|-----|-------------|
| Repayment | 40% | 340 | Loan repayments |
| DeFi Activity | 20% | 170 | Protocol interactions |
| Wallet Age | 15% | 128 | Account age |
| Token Diversity | 10% | 85 | Unique tokens |
| DAO Participation | 15% | 128 | Governance votes |

**Total Range:** 300-850

## 🎯 Grade Scale

- **A (750-850):** Excellent - Up to 80% LTV
- **B (650-749):** Good - Up to 60% LTV
- **C (550-649):** Fair - Up to 40% LTV
- **D (450-549):** Poor - Up to 20% LTV
- **F (300-449):** Very Poor - Collateralized only

## 🔐 Environment Variables

### Backend (.env)
```bash
HELIUS_API_KEY=your_key
DATABASE_URL=postgresql://user:pass@localhost:5432/solscore
REDIS_URL=redis://localhost:6379/0
SOLANA_RPC_URL=https://api.devnet.solana.com
AUTHORITY_PRIVATE_KEY=your_key
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🧪 Testing

```bash
# Anchor tests
anchor test

# Backend tests
cd backend && pytest

# Frontend tests (add later)
cd frontend && npm test
```

## 🐛 Troubleshooting

### Anchor build fails
```bash
# Clean and rebuild
anchor clean
rm -rf target
anchor build
```

### Backend can't connect to database
```bash
# Check if PostgreSQL is running
docker-compose ps
# Restart PostgreSQL
docker-compose restart postgres
```

### Frontend can't connect to wallet
```bash
# Check wallet adapter installation
cd frontend && npm install @solana/wallet-adapter-react
# Clear browser cache
```

### Celery tasks not processing
```bash
# Check Redis connection
redis-cli ping
# Restart Celery worker
pkill -f celery
celery -A tasks.score_job worker --loglevel=info
```

## 📚 Documentation

- **README.md** - Project overview
- **PROJECT_OVERVIEW.md** - Detailed architecture
- **DEPLOYMENT.md** - Deployment guide
- **CHECKLIST.md** - Development checklist
- **API Docs** - http://localhost:8000/docs

## 🔗 Useful Links

- [Anchor Docs](https://www.anchor-lang.com/)
- [Solana Docs](https://docs.solana.com/)
- [Helius Docs](https://docs.helius.dev/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js Docs](https://nextjs.org/docs)

## 💡 Tips

1. Always test on Devnet first
2. Keep your Helius API key secret
3. Monitor Celery queue length
4. Cache frequently accessed scores
5. Use wallet signatures for authentication
6. Keep dependencies updated
7. Monitor error logs regularly
8. Backup database regularly

## 🆘 Getting Help

1. Check documentation files
2. Review error logs
3. Search GitHub issues
4. Ask in Solana Discord
5. Check Anchor Discord

## 📝 Next Steps

1. ✅ Project scaffolded
2. ⏳ Test on Devnet
3. ⏳ Complete NFT minting
4. ⏳ Deploy to staging
5. ⏳ Security audit
6. ⏳ Deploy to mainnet

---

**Version:** 0.1.0  
**Last Updated:** 2026-05-08  
**Status:** Development
