import time

def calculate_wallet_age_score(first_transaction_timestamp: int) -> int:
    """
    Calculate wallet age score (0-128 points, 15% weight)
    Older wallets get higher scores
    """
    if first_transaction_timestamp == 0:
        return 0
    
    current_time = int(time.time())
    age_in_days = (current_time - first_transaction_timestamp) // (24 * 60 * 60)
    
    # Score tiers
    if age_in_days >= 730:  # 2+ years
        return 128
    elif age_in_days >= 365:  # 1-2 years
        return 96
    elif age_in_days >= 180:  # 6-12 months
        return 64
    elif age_in_days >= 90:  # 3-6 months
        return 32
    else:  # < 3 months
        return 16
