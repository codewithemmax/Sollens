from typing import List, Dict, Any

LENDING_PROTOCOLS = ["Solend", "Kamino", "MarginFi", "Mango"]

def calculate_repayment_score(transactions: List[Dict[str, Any]]) -> int:
    """
    Calculate repayment history score (0-340 points, 40% weight)
    Checks for loan repayments on major lending protocols
    """
    repayments = 0
    defaults = 0
    
    for tx in transactions:
        if not tx.get("description"):
            continue
            
        desc = tx["description"].lower()
        
        # Check for repayment transactions
        if any(protocol.lower() in desc for protocol in LENDING_PROTOCOLS):
            if "repay" in desc or "payback" in desc:
                repayments += 1
            elif "liquidat" in desc:
                defaults += 1
    
    if repayments == 0:
        return 170  # Neutral score if no lending activity
    
    # Calculate score based on repayment ratio
    total_loans = repayments + defaults
    repayment_ratio = repayments / total_loans if total_loans > 0 else 0
    
    # Perfect repayment = 340, scale down for defaults
    score = int(340 * repayment_ratio)
    
    return max(0, min(340, score))
