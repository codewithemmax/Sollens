from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import score, webhook
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="SolScore API",
    description="Decentralized On-Chain Credit Scoring System",
    version="0.1.0"
)

# Production CORS configuration
allowed_origins = [
    "http://localhost:3000",  # Development
    "https://localhost:3000",  # Development HTTPS
]

# Add production origins from environment
if os.getenv("ALLOWED_ORIGINS"):
    allowed_origins.extend(os.getenv("ALLOWED_ORIGINS").split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include routers
app.include_router(score.router, prefix="/api", tags=["score"])
app.include_router(webhook.router, prefix="/api", tags=["webhook"])

@app.get("/")
async def root():
    return {"message": "SolScore API", "version": "0.1.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
