from typing import List, Dict, Any

def calculate_token_diversity_score(token_balances: List[Dict[str, Any]]) -> int:
    """
    Calculate token diversity score (0-85 points, 10% weight)
    More unique tokens = higher score
    """
    unique_tokens = len(token_balances)
    
    # Score tiers
    if unique_tokens >= 20:
        return 85
    elif unique_tokens >= 15:
        return 68
    elif unique_tokens >= 10:
        return 51
    elif unique_tokens >= 5:
        return 34
    else:
        return max(unique_tokens * 5, 0)
