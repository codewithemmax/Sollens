from fastapi import APIRouter, Request
from tasks.score_job import compute_score_task

router = APIRouter()

@router.post("/webhook/helius")
async def helius_webhook(request: Request):
    """Handle Helius webhook for real-time wallet activity"""
    data = await request.json()
    
    # Extract wallet address from webhook payload
    wallet = data.get("account")
    
    if wallet:
        # Trigger score recomputation
        compute_score_task.delay(wallet)
    
    return {"status": "received"}
