from typing import Dict, Any
from .helius import HeliusClient
from .factors.repayment import calculate_repayment_score
from .factors.defi_activity import calculate_defi_activity_score
from .factors.wallet_age import calculate_wallet_age_score
from .factors.token_diversity import calculate_token_diversity_score
from .factors.dao_participation import calculate_dao_participation_score

class ScoringEngine:
    def __init__(self):
        self.helius = HeliusClient()
    
    async def calculate_score(self, wallet_address: str) -> Dict[str, Any]:
        """
        Calculate comprehensive credit score for a wallet
        Returns score (300-850) and breakdown
        """
        # Fetch data from Helius
        transactions = await self.helius.get_transaction_history(wallet_address)
        token_balances = await self.helius.get_token_balances(wallet_address)
        first_tx_timestamp = await self.helius.get_wallet_age(wallet_address)
        
        # Calculate individual factor scores
        repayment = calculate_repayment_score(transactions)
        defi_activity = calculate_defi_activity_score(transactions)
        wallet_age = calculate_wallet_age_score(first_tx_timestamp)
        token_diversity = calculate_token_diversity_score(token_balances)
        dao_participation = calculate_dao_participation_score(transactions)
        
        # Calculate total score
        total_score = repayment + defi_activity + wallet_age + token_diversity + dao_participation
        
        # Ensure score is within 300-850 range
        final_score = max(300, min(850, total_score))
        
        # Determine grade
        if final_score >= 750:
            grade = "A"
        elif final_score >= 650:
            grade = "B"
        elif final_score >= 550:
            grade = "C"
        elif final_score >= 450:
            grade = "D"
        else:
            grade = "F"
        
        return {
            "score": final_score,
            "grade": grade,
            "breakdown": {
                "repayment_history": repayment,
                "defi_activity": defi_activity,
                "wallet_age": wallet_age,
                "token_diversity": token_diversity,
                "dao_participation": dao_participation
            }
        }
