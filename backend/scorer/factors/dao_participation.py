from typing import List, Dict, Any

def calculate_dao_participation_score(transactions: List[Dict[str, Any]]) -> int:
    """
    Calculate DAO governance participation score (0-128 points, 15% weight)
    Checks for Realms.today votes and governance activity
    """
    votes_cast = 0
    proposals_created = 0
    
    for tx in transactions:
        if not tx.get("description"):
            continue
            
        desc = tx["description"].lower()
        
        # Check for governance activity
        if "realms" in desc or "governance" in desc or "vote" in desc:
            if "cast vote" in desc or "voted" in desc:
                votes_cast += 1
            elif "proposal" in desc:
                proposals_created += 1
    
    # Score calculation
    vote_score = min(votes_cast * 5, 100)  # Max 100 for 20+ votes
    proposal_score = min(proposals_created * 14, 28)  # Max 28 for 2+ proposals
    
    total_score = vote_score + proposal_score
    
    return max(0, min(128, total_score))
