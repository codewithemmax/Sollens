use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct InitializeScoreAccount<'info> {
    #[account(
        init,
        payer = wallet,
        space = ScoreAccount::LEN,
        seeds = [b"score", wallet.key().as_ref()],
        bump
    )]
    pub score_account: Account<'info, ScoreAccount>,
    
    #[account(mut)]
    pub wallet: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeScoreAccount>) -> Result<()> {
    let score_account = &mut ctx.accounts.score_account;
    score_account.wallet = ctx.accounts.wallet.key();
    score_account.score = 0;
    score_account.grade = Grade::F;
    score_account.last_updated = Clock::get()?.unix_timestamp;
    score_account.mint = Pubkey::default();
    score_account.breakdown = ScoreBreakdown {
        repayment_history: 0,
        defi_activity: 0,
        wallet_age: 0,
        token_diversity: 0,
        dao_participation: 0,
    };
    score_account.bump = ctx.bumps.score_account;
    
    Ok(())
}
