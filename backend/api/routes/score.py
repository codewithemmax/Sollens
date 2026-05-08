from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
import nacl.signing
import nacl.encoding
from tasks.score_job import compute_score_task
from celery.result import AsyncResult
import redis
import json
import os

router = APIRouter()
redis_client = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379/0"))

class ScoreRequest(BaseModel):
    wallet: str
    signature: str
    message: str

class ScoreResponse(BaseModel):
    wallet: str
    score: int
    grade: str
    breakdown: dict
    task_id: Optional[str] = None

def verify_wallet_signature(wallet: str, message: str, signature: str) -> bool:
    """Verify wallet signature using nacl"""
    try:
        verify_key = nacl.signing.VerifyKey(wallet, encoder=nacl.encoding.Base58Encoder)
        verify_key.verify(message.encode(), bytes.fromhex(signature))
        return True
    except Exception:
        return False

@router.post("/score", response_model=dict)
async def request_score(request: ScoreRequest):
    """Request score computation for a wallet"""
    # Verify signature
    if not verify_wallet_signature(request.wallet, request.message, request.signature):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    # Check cache first
    cached = redis_client.get(f"score:{request.wallet}")
    if cached:
        return {"status": "completed", "data": json.loads(cached)}
    
    # Start async task
    task = compute_score_task.delay(request.wallet)
    
    return {
        "status": "processing",
        "task_id": task.id,
        "message": "Score computation started"
    }

@router.get("/score/{wallet}", response_model=ScoreResponse)
async def get_score(wallet: str):
    """Get computed score for a wallet"""
    # Check cache
    cached = redis_client.get(f"score:{wallet}")
    if cached:
        data = json.loads(cached)
        return ScoreResponse(wallet=wallet, **data)
    
    raise HTTPException(status_code=404, detail="Score not found. Please request computation first.")

@router.get("/score/task/{task_id}")
async def get_task_status(task_id: str):
    """Check status of score computation task"""
    task = AsyncResult(task_id)
    
    if task.ready():
        result = task.get()
        # Cache result for 1 hour
        redis_client.setex(
            f"score:{result.get('wallet')}",
            3600,
            json.dumps(result)
        )
        return {"status": "completed", "data": result}
    
    return {"status": "processing", "task_id": task_id}
