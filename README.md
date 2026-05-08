# SolScore - Decentralized On-Chain Credit Scoring System

A full-stack Web3 application that analyzes Solana wallet transaction history and generates a credit score (300-850) stored as a non-transferable Soulbound NFT.

## 🎯 Features

- **Credit Scoring Algorithm**: Analyzes 5 key factors with weighted scoring
  - Repayment History (40%)
  - DeFi Activity (20%)
  - Wallet Age (15%)
  - Token Diversity (10%)
  - DAO Participation (15%)

- **Soulbound NFT**: Non-transferable NFT proving creditworthiness
- **Lender Portal**: Query any wallet's credit score
- **Real-time Updates**: Helius webhooks for automatic score updates

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend    │────▶│   Helius    │
│  (Next.js)  │     │  (FastAPI)   │     │     API     │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Solana     │
                    │   Program    │
                    │  (Anchor)    │
                    └──────────────┘
```

## 📋 Prerequisites

- Node.js 20+
- Python 3.11+
- Rust & Anchor CLI 0.30+
- Solana CLI
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd solscore
```

### 2. Setup Environment Variables

Backend:
```bash
cd backend
cp .env.example .env
# Edit .env with your Helius API key
```

Frontend:
```bash
cd frontend
cp .env.local.example .env.local
```

### 3. Build Anchor Program

```bash
anchor build
anchor deploy --provider.cluster devnet
```

### 4. Run with Docker Compose

```bash
docker-compose up -d
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### 5. Manual Setup (Alternative)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Celery Worker:**
```bash
celery -A tasks.score_job worker --loglevel=info
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

**Anchor Tests:**
```bash
anchor test
```

**Python Tests:**
```bash
cd backend
pytest
```

## 📚 API Documentation

### POST /api/score
Request score computation for a wallet.

**Request:**
```json
{
  "wallet": "wallet_address",
  "signature": "signed_message",
  "message": "Request SolScore for {wallet}"
}
```

### GET /api/score/{wallet}
Get computed score for a wallet.

**Response:**
```json
{
  "wallet": "wallet_address",
  "score": 750,
  "grade": "A",
  "breakdown": {
    "repayment_history": 340,
    "defi_activity": 170,
    "wallet_age": 128,
    "token_diversity": 85,
    "dao_participation": 128
  }
}
```

## 🔐 Smart Contract Instructions

1. **initialize_score_account**: Creates PDA for wallet
2. **mint_score_nft**: Mints Soulbound NFT with score
3. **update_score**: Updates score (30-day cooldown)
4. **query_score**: Read-only score query

## 🛠️ Tech Stack

**Blockchain:**
- Solana (Devnet/Mainnet)
- Anchor Framework 0.30+
- Metaplex Token Metadata

**Backend:**
- Python 3.11 + FastAPI
- PostgreSQL + SQLAlchemy
- Redis + Celery
- Helius API

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Solana Wallet Adapter
- Recharts

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Support

For issues and questions, please open a GitHub issue.
