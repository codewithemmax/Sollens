use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct UpdateScore<'info> {
    #[account(
        mut,
        seeds = [b"score", wallet.key().as_ref()],
        bump = score_account.bump,
        has_one = wallet
    )]
    pub score_account: Account<'info, ScoreAccount>,
    
    #[account(mut)]
    pub wallet: Signer<'info>,
    
    /// CHECK: Authority that can update scores (backend service)
    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<UpdateScore>,
    new_score: u16,
    breakdown: ScoreBreakdown,
) -> Result<()> {
    require!(new_score >= 300 && new_score <= 850, ErrorCode::InvalidScore);
    
    let score_account = &mut ctx.accounts.score_account;
    
    // Check if 30 days have passed since last update
    let current_time = Clock::get()?.unix_timestamp;
    let time_diff = current_time - score_account.last_updated;
    let thirty_days = 30 * 24 * 60 * 60;
    
    require!(time_diff >= thirty_days, ErrorCode::UpdateTooSoon);
    
    score_account.score = new_score;
    score_account.grade = Grade::from_score(new_score);
    score_account.last_updated = current_time;
    score_account.breakdown = breakdown;
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Score must be between 300 and 850")]
    InvalidScore,
    #[msg("Score can only be updated once every 30 days")]
    UpdateTooSoon,
}
