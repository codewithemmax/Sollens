from typing import List, Dict, Any

DEFI_PROTOCOLS = ["Raydium", "Orca", "Jupiter", "Drift", "Mango", "Serum"]

def calculate_defi_activity_score(transactions: List[Dict[str, Any]]) -> int:
    """
    Calculate DeFi activity score (0-170 points, 20% weight)
    Measures depth of engagement with DeFi protocols
    """
    protocol_interactions = set()
    swap_count = 0
    lp_positions = 0
    
    for tx in transactions:
        if not tx.get("description"):
            continue
            
        desc = tx["description"].lower()
        
        # Track unique protocol interactions
        for protocol in DEFI_PROTOCOLS:
            if protocol.lower() in desc:
                protocol_interactions.add(protocol)
        
        # Count swaps
        if "swap" in desc or "trade" in desc:
            swap_count += 1
        
        # Count LP positions
        if "liquidity" in desc or "pool" in desc:
            lp_positions += 1
    
    # Score calculation
    protocol_score = min(len(protocol_interactions) * 20, 80)  # Max 80 for 4+ protocols
    swap_score = min(swap_count // 10 * 10, 50)  # Max 50 for 50+ swaps
    lp_score = min(lp_positions * 10, 40)  # Max 40 for 4+ LP positions
    
    total_score = protocol_score + swap_score + lp_score
    
    return max(0, min(170, total_score))
