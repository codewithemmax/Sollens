import pytest
from backend.scorer.factors.repayment import calculate_repayment_score
from backend.scorer.factors.defi_activity import calculate_defi_activity_score
from backend.scorer.factors.wallet_age import calculate_wallet_age_score
from backend.scorer.factors.token_diversity import calculate_token_diversity_score
from backend.scorer.factors.dao_participation import calculate_dao_participation_score
import time

def test_repayment_score_perfect():
    transactions = [
        {"description": "Solend repay loan"},
        {"description": "Kamino repayback"},
    ]
    score = calculate_repayment_score(transactions)
    assert score == 340

def test_repayment_score_with_default():
    transactions = [
        {"description": "Solend repay loan"},
        {"description": "Kamino liquidation"},
    ]
    score = calculate_repayment_score(transactions)
    assert score == 170

def test_defi_activity_score():
    transactions = [
        {"description": "Raydium swap SOL to USDC"},
        {"description": "Orca add liquidity pool"},
        {"description": "Jupiter trade"},
    ]
    score = calculate_defi_activity_score(transactions)
    assert score > 0

def test_wallet_age_score_old():
    two_years_ago = int(time.time()) - (730 * 24 * 60 * 60)
    score = calculate_wallet_age_score(two_years_ago)
    assert score == 128

def test_wallet_age_score_new():
    one_month_ago = int(time.time()) - (30 * 24 * 60 * 60)
    score = calculate_wallet_age_score(one_month_ago)
    assert score == 16

def test_token_diversity_score():
    tokens = [{"mint": f"token_{i}"} for i in range(20)]
    score = calculate_token_diversity_score(tokens)
    assert score == 85

def test_dao_participation_score():
    transactions = [
        {"description": "Realms cast vote on proposal"},
        {"description": "Governance voted yes"},
    ]
    score = calculate_dao_participation_score(transactions)
    assert score > 0
