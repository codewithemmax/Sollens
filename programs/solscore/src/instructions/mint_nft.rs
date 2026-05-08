use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, mint_to, MintTo, set_authority, SetAuthority};
use anchor_spl::associated_token::AssociatedToken;
use mpl_token_metadata::instructions::{CreateV1CpiBuilder, FreezeDelegatedAccountCpiBuilder};
use mpl_token_metadata::types::{TokenStandard, PrintSupply};
use crate::state::*;

#[derive(Accounts)]
pub struct MintScoreNft<'info> {
    #[account(
        mut,
        seeds = [b"score", wallet.key().as_ref()],
        bump = score_account.bump,
        has_one = wallet
    )]
    pub score_account: Account<'info, ScoreAccount>,
    
    #[account(
        init,
        payer = wallet,
        mint::decimals = 0,
        mint::authority = wallet,
        mint::freeze_authority = wallet
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = wallet,
        associated_token::mint = mint,
        associated_token::authority = wallet
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Metaplex metadata account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    
    /// CHECK: Metaplex master edition account
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub wallet: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    
    /// CHECK: Metaplex Token Metadata Program
    pub token_metadata_program: UncheckedAccount<'info>,
}

pub fn handler(
    ctx: Context<MintScoreNft>,
    score: u16,
    breakdown: ScoreBreakdown,
    uri: String,
) -> Result<()> {
    require!(score >= 300 && score <= 850, ErrorCode::InvalidScore);
    
    let score_account = &mut ctx.accounts.score_account;
    score_account.score = score;
    score_account.grade = Grade::from_score(score);
    score_account.last_updated = Clock::get()?.unix_timestamp;
    score_account.mint = ctx.accounts.mint.key();
    score_account.breakdown = breakdown;
    
    // Mint 1 NFT to wallet
    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.wallet.to_account_info(),
            },
        ),
        1,
    )?;
    
    // Create metadata
    let name = format!("SolScore #{}", score);
    let symbol = "SCORE".to_string();
    
    CreateV1CpiBuilder::new(&ctx.accounts.token_metadata_program.to_account_info())
        .metadata(&ctx.accounts.metadata.to_account_info())
        .master_edition(Some(&ctx.accounts.master_edition.to_account_info()))
        .mint(&ctx.accounts.mint.to_account_info(), true)
        .authority(&ctx.accounts.wallet.to_account_info())
        .payer(&ctx.accounts.wallet.to_account_info())
        .update_authority(&ctx.accounts.wallet.to_account_info(), true)
        .system_program(&ctx.accounts.system_program.to_account_info())
        .sysvar_instructions(&ctx.accounts.rent.to_account_info())
        .spl_token_program(Some(&ctx.accounts.token_program.to_account_info()))
        .name(name)
        .symbol(symbol)
        .uri(uri)
        .seller_fee_basis_points(0)
        .token_standard(TokenStandard::NonFungible)
        .print_supply(PrintSupply::Zero)
        .invoke()?;
    
    // Freeze the token account to make it non-transferable
    FreezeDelegatedAccountCpiBuilder::new(&ctx.accounts.token_metadata_program.to_account_info())
        .delegate(&ctx.accounts.wallet.to_account_info())
        .token_account(&ctx.accounts.token_account.to_account_info())
        .edition(&ctx.accounts.master_edition.to_account_info())
        .mint(&ctx.accounts.mint.to_account_info())
        .token_program(&ctx.accounts.token_program.to_account_info())
        .invoke()?;
    
    // Remove freeze authority to make it permanently non-transferable
    set_authority(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            SetAuthority {
                current_authority: ctx.accounts.wallet.to_account_info(),
                account_or_mint: ctx.accounts.mint.to_account_info(),
            },
        ),
        anchor_spl::token::spl_token::instruction::AuthorityType::FreezeAccount,
        None,
    )?;
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Score must be between 300 and 850")]
    InvalidScore,
}
