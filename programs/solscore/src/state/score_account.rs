use anchor_lang::prelude::*;

#[account]
pub struct ScoreAccount {
    pub wallet: Pubkey,
    pub score: u16,
    pub grade: Grade,
    pub last_updated: i64,
    pub mint: Pubkey,
    pub breakdown: ScoreBreakdown,
    pub bump: u8,
}

impl ScoreAccount {
    pub const LEN: usize = 8 + 32 + 2 + 1 + 8 + 32 + ScoreBreakdown::LEN + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum Grade {
    A, // 750-850
    B, // 650-749
    C, // 550-649
    D, // 450-549
    F, // 300-449
}

impl Grade {
    pub fn from_score(score: u16) -> Self {
        match score {
            750..=850 => Grade::A,
            650..=749 => Grade::B,
            550..=649 => Grade::C,
            450..=549 => Grade::D,
            _ => Grade::F,
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub struct ScoreBreakdown {
    pub repayment_history: u16,    // 40% weight
    pub defi_activity: u16,        // 20% weight
    pub wallet_age: u16,           // 15% weight
    pub token_diversity: u16,      // 10% weight
    pub dao_participation: u16,    // 15% weight
}

impl ScoreBreakdown {
    pub const LEN: usize = 2 + 2 + 2 + 2 + 2;

    pub fn calculate_total(&self) -> u16 {
        let total = (self.repayment_history as f64 * 0.40)
            + (self.defi_activity as f64 * 0.20)
            + (self.wallet_age as f64 * 0.15)
            + (self.token_diversity as f64 * 0.10)
            + (self.dao_participation as f64 * 0.15);
        total.round() as u16
    }
}
