use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

use instructions::*;
use state::*;

declare_id!("ScoREJVqH9K3F7RqvhQxZ8yYxJxZ8yYxJxZ8yYxJxZ8");

#[program]
pub mod solscore {
    use super::*;

    pub fn initialize_score_account(ctx: Context<InitializeScoreAccount>) -> Result<()> {
        instructions::initialize::handler(ctx)
    }

    pub fn mint_score_nft(
        ctx: Context<MintScoreNft>,
        score: u16,
        breakdown: ScoreBreakdown,
        uri: String,
    ) -> Result<()> {
        instructions::mint_nft::handler(ctx, score, breakdown, uri)
    }

    pub fn update_score(
        ctx: Context<UpdateScore>,
        new_score: u16,
        breakdown: ScoreBreakdown,
    ) -> Result<()> {
        instructions::update_score::handler(ctx, new_score, breakdown)
    }

    pub fn query_score(ctx: Context<QueryScore>, wallet_address: Pubkey) -> Result<ScoreData> {
        instructions::query_score::handler(ctx, wallet_address)
    }
}
