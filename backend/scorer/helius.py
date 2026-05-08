import httpx
from typing import List, Dict, Any
import os

class HeliusClient:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("HELIUS_API_KEY")
        self.base_url = f"https://api.helius.xyz/v0"
        
    async def get_transaction_history(self, wallet: str, limit: int = 1000) -> List[Dict[str, Any]]:
        """Fetch enriched transaction history for a wallet"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/addresses/{wallet}/transactions",
                params={"api-key": self.api_key, "limit": limit}
            )
            response.raise_for_status()
            return response.json()
    
    async def get_token_balances(self, wallet: str) -> List[Dict[str, Any]]:
        """Fetch token balances for a wallet"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/addresses/{wallet}/balances",
                params={"api-key": self.api_key}
            )
            response.raise_for_status()
            return response.json()
    
    async def get_wallet_age(self, wallet: str) -> int:
        """Get timestamp of first transaction"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/addresses/{wallet}/transactions",
                params={"api-key": self.api_key, "limit": 1, "sort": "asc"}
            )
            response.raise_for_status()
            data = response.json()
            if data and len(data) > 0:
                return data[0].get("timestamp", 0)
            return 0
