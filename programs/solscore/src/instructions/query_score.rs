use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(wallet_address: Pubkey)]
pub struct QueryScore<'info> {
    #[account(
        seeds = [b"score", wallet_address.as_ref()],
        bump = score_account.bump
    )]
    pub score_account: Account<'info, ScoreAccount>,
}

pub fn handler(ctx: Context<QueryScore>, _wallet_address: Pubkey) -> Result<ScoreData> {
    let score_account = &ctx.accounts.score_account;
    
    Ok(ScoreData {
        wallet: score_account.wallet,
        score: score_account.score,
        grade: score_account.grade,
        last_updated: score_account.last_updated,
        mint: score_account.mint,
        breakdown: score_account.breakdown,
    })
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ScoreData {
    pub wallet: Pubkey,
    pub score: u16,
    pub grade: Grade,
    pub last_updated: i64,
    pub mint: Pubkey,
    pub breakdown: ScoreBreakdown,
}
