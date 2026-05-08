from celery import Celery
import os
from scorer.engine import ScoringEngine
import asyncio

celery_app = Celery(
    "solscore",
    broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    backend=os.getenv("REDIS_URL", "redis://localhost:6379/0")
)

@celery_app.task(name="compute_score")
def compute_score_task(wallet_address: str):
    """Async task to compute credit score"""
    engine = ScoringEngine()
    result = asyncio.run(engine.calculate_score(wallet_address))
    return result
