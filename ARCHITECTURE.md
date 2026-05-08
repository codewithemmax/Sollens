# SolScore Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                             │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Landing    │  │  Dashboard   │  │    Lender    │              │
│  │     Page     │  │     Page     │  │    Portal    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│                    Next.js 14 + Tailwind CSS                         │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            │ HTTPS/WebSocket
                            │
┌───────────────────────────▼───────────────────────────────────────┐
│                      WALLET ADAPTER LAYER                          │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Phantom  │  │ Backpack │  │ Solflare │  │  Others  │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌───────────────────────┐   ┌───────────────────────┐
│   BACKEND API LAYER   │   │   BLOCKCHAIN LAYER    │
│                       │   │                       │
│  ┌─────────────────┐ │   │  ┌─────────────────┐ │
│  │   FastAPI REST  │ │   │  │  Solana Program │ │
│  │      API        │ │   │  │    (Anchor)     │ │
│  └─────────────────┘ │   │  └─────────────────┘ │
│                       │   │                       │
│  ┌─────────────────┐ │   │  ┌─────────────────┐ │
│  │  Celery Worker  │ │   │  │   Metaplex NFT  │ │
│  │   (Async Jobs)  │ │   │  │    Metadata     │ │
│  └─────────────────┘ │   │  └─────────────────┘ │
│                       │   │                       │
│  ┌─────────────────┐ │   │  ┌─────────────────┐ │
│  │ Scoring Engine  │ │   │  │   SPL Token     │ │
│  │   (Algorithm)   │ │   │  │    Program      │ │
│  └─────────────────┘ │   │  └─────────────────┘ │
└───────┬───────────────┘   └───────────────────────┘
        │
        │
        ▼
┌───────────────────────┐
│   DATA LAYER          │
│                       │
│  ┌─────────────────┐ │
│  │   PostgreSQL    │ │
│  │   (Wallet Data) │ │
│  └─────────────────┘ │
│                       │
│  ┌─────────────────┐ │
│  │     Redis       │ │
│  │  (Cache/Queue)  │ │
│  └─────────────────┘ │
└───────┬───────────────┘
        │
        │
        ▼
┌───────────────────────┐
│  EXTERNAL SERVICES    │
│                       │
│  ┌─────────────────┐ │
│  │   Helius API    │ │
│  │  (Transaction   │ │
│  │    History)     │ │
│  └─────────────────┘ │
│                       │
│  ┌─────────────────┐ │
│  │ Helius Webhooks │ │
│  │  (Real-time)    │ │
│  └─────────────────┘ │
└───────────────────────┘
```

## Data Flow Diagram

### Score Calculation Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1. Connect Wallet
     ▼
┌──────────────────┐
│    Frontend      │
└────┬─────────────┘
     │ 2. Sign Message
     ▼
┌──────────────────┐
│  Backend API     │
│  POST /api/score │
└────┬─────────────┘
     │ 3. Verify Signature
     │ 4. Create Celery Task
     ▼
┌──────────────────┐
│  Celery Worker   │
└────┬─────────────┘
     │ 5. Fetch Data
     ▼
┌──────────────────┐
│   Helius API     │
│  - Transactions  │
│  - Token Balance │
│  - Wallet Age    │
└────┬─────────────┘
     │ 6. Return Data
     ▼
┌──────────────────┐
│ Scoring Engine   │
│  - Repayment     │
│  - DeFi Activity │
│  - Wallet Age    │
│  - Token Div.    │
│  - DAO Part.     │
└────┬─────────────┘
     │ 7. Calculate Score
     ▼
┌──────────────────┐
│  Redis Cache     │
│  (1 hour TTL)    │
└────┬─────────────┘
     │ 8. Return Result
     ▼
┌──────────────────┐
│    Frontend      │
│  Display Score   │
└──────────────────┘
```

### NFT Minting Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1. Click "Mint NFT"
     ▼
┌──────────────────┐
│    Frontend      │
└────┬─────────────┘
     │ 2. Create Mint Account
     │ 3. Prepare Transaction
     ▼
┌──────────────────┐
│  Solana Program  │
│  mint_score_nft  │
└────┬─────────────┘
     │ 4. Mint 1 Token
     │ 5. Create Metadata
     ▼
┌──────────────────┐
│ Metaplex Program │
│  Create NFT      │
└────┬─────────────┘
     │ 6. Freeze Account
     │ 7. Remove Authority
     ▼
┌──────────────────┐
│  User's Wallet   │
│  Soulbound NFT   │
│  (Non-transfer)  │
└──────────────────┘
```

### Lender Query Flow

```
┌──────────┐
│  Lender  │
└────┬─────┘
     │ 1. Enter Wallet Address
     ▼
┌──────────────────┐
│  Lender Portal   │
└────┬─────────────┘
     │ 2. GET /api/score/{wallet}
     ▼
┌──────────────────┐
│  Backend API     │
└────┬─────────────┘
     │ 3. Check Redis Cache
     ▼
┌──────────────────┐
│  Redis Cache     │
└────┬─────────────┘
     │ 4. Return Score Data
     ▼
┌──────────────────┐
│  Lender Portal   │
│  - Score         │
│  - Grade         │
│  - Breakdown     │
│  - Risk Level    │
│  - LTV Suggest   │
└──────────────────┘
```

## Component Architecture

### Smart Contract Layer

```
┌─────────────────────────────────────────┐
│         Solana Program (Anchor)         │
├─────────────────────────────────────────┤
│                                         │
│  Instructions:                          │
│  ┌───────────────────────────────────┐ │
│  │ initialize_score_account()        │ │
│  │ - Creates PDA for wallet          │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ mint_score_nft()                  │ │
│  │ - Mints Soulbound NFT             │ │
│  │ - Stores score in metadata        │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ update_score()                    │ │
│  │ - Updates score (30-day cooldown) │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ query_score()                     │ │
│  │ - Read-only score query           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  State:                                 │
│  ┌───────────────────────────────────┐ │
│  │ ScoreAccount                      │ │
│  │ - wallet: Pubkey                  │ │
│  │ - score: u16                      │ │
│  │ - grade: Grade                    │ │
│  │ - last_updated: i64               │ │
│  │ - mint: Pubkey                    │ │
│  │ - breakdown: ScoreBreakdown       │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Backend Architecture

```
┌─────────────────────────────────────────┐
│           FastAPI Backend               │
├─────────────────────────────────────────┤
│                                         │
│  API Routes:                            │
│  ┌───────────────────────────────────┐ │
│  │ POST /api/score                   │ │
│  │ GET  /api/score/{wallet}          │ │
│  │ GET  /api/score/task/{task_id}    │ │
│  │ POST /api/webhook/helius          │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Scoring Engine:                        │
│  ┌───────────────────────────────────┐ │
│  │ Repayment History (40%)           │ │
│  │ DeFi Activity (20%)               │ │
│  │ Wallet Age (15%)                  │ │
│  │ Token Diversity (10%)             │ │
│  │ DAO Participation (15%)           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Async Processing:                      │
│  ┌───────────────────────────────────┐ │
│  │ Celery Worker                     │ │
│  │ - Score computation tasks         │ │
│  │ - Redis as broker                 │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│         Next.js 14 Frontend             │
├─────────────────────────────────────────┤
│                                         │
│  Pages (App Router):                    │
│  ┌───────────────────────────────────┐ │
│  │ / (Landing)                       │ │
│  │ /dashboard (User Dashboard)       │ │
│  │ /lender (Lender Portal)           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Components:                            │
│  ┌───────────────────────────────────┐ │
│  │ WalletConnect                     │ │
│  │ ScoreCard                         │ │
│  │ ScoreBreakdown                    │ │
│  │ MintButton                        │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Libraries:                             │
│  ┌───────────────────────────────────┐ │
│  │ Anchor Client                     │ │
│  │ Helius Helpers                    │ │
│  │ Wallet Adapter                    │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│          Security Layers                │
├─────────────────────────────────────────┤
│                                         │
│  1. Wallet Authentication               │
│     - Signature verification            │
│     - Message signing                   │
│                                         │
│  2. Smart Contract Security             │
│     - PDA-based accounts                │
│     - Authority checks                  │
│     - Non-transferable NFTs             │
│                                         │
│  3. API Security                        │
│     - Rate limiting                     │
│     - Input validation                  │
│     - CORS restrictions                 │
│                                         │
│  4. Data Security                       │
│     - Encrypted connections             │
│     - Secure key storage                │
│     - No PII storage                    │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│            Production Setup             │
├─────────────────────────────────────────┤
│                                         │
│  Frontend (Vercel)                      │
│  ┌───────────────────────────────────┐ │
│  │ Next.js App                       │ │
│  │ CDN Distribution                  │ │
│  │ Auto-scaling                      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Backend (Railway/Render)               │
│  ┌───────────────────────────────────┐ │
│  │ FastAPI Service                   │ │
│  │ Celery Workers                    │ │
│  │ Auto-scaling                      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Database (Managed PostgreSQL)          │
│  ┌───────────────────────────────────┐ │
│  │ Primary + Replicas                │ │
│  │ Automated backups                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Cache (Managed Redis)                  │
│  ┌───────────────────────────────────┐ │
│  │ Redis Cluster                     │ │
│  │ High availability                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Blockchain (Solana Mainnet)            │
│  ┌───────────────────────────────────┐ │
│  │ Deployed Program                  │ │
│  │ Immutable code                    │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

**Last Updated:** 2026-05-08  
**Version:** 1.0
