use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("TokenLock111111111111111111111111111111111");

#[program]
pub mod token_lock {
    use super::*;

    /// Initialize a new lock vault for a specific token
    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        vault_bump: u8,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.token_mint = ctx.accounts.token_mint.key();
        vault.bump = vault_bump;
        vault.total_locked = 0;
        
        Ok(())
    }

    /// Lock tokens into the vault for a specified period
    pub fn lock_tokens(
        ctx: Context<LockTokens>,
        amount: u64,
        unlock_timestamp: i64,
    ) -> Result<()> {
        require!(
            unlock_timestamp > Clock::get()?.unix_timestamp,
            ErrorCode::InvalidUnlockTime
        );
        
        require!(
            amount > 0,
            ErrorCode::InvalidAmount
        );

        // Transfer tokens from user to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Create lock record
        let lock_record = &mut ctx.accounts.lock_record;
        lock_record.owner = ctx.accounts.user.key();
        lock_record.amount = amount;
        lock_record.unlock_timestamp = unlock_timestamp;
        lock_record.locked_at = Clock::get()?.unix_timestamp;
        lock_record.vault = ctx.accounts.vault.key();
        lock_record.is_unlocked = false;

        // Update vault total
        let vault = &mut ctx.accounts.vault;
        vault.total_locked = vault.total_locked.checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;

        emit!(TokensLocked {
            user: ctx.accounts.user.key(),
            amount,
            unlock_timestamp,
            vault: ctx.accounts.vault.key(),
        });

        Ok(())
    }

    /// Unlock tokens after the lock period has expired
    pub fn unlock_tokens(ctx: Context<UnlockTokens>) -> Result<()> {
        let lock_record = &ctx.accounts.lock_record;
        
        require!(
            !lock_record.is_unlocked,
            ErrorCode::AlreadyUnlocked
        );
        
        require!(
            Clock::get()?.unix_timestamp >= lock_record.unlock_timestamp,
            ErrorCode::LockPeriodNotExpired
        );

        // Transfer tokens back to user
        let vault = &ctx.accounts.vault;
        let vault_seeds = &[
            b"vault",
            vault.token_mint.as_ref(),
            &[vault.bump],
        ];
        let signer = &[&vault_seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, lock_record.amount)?;

        // Update lock record
        let lock_record = &mut ctx.accounts.lock_record;
        lock_record.is_unlocked = true;

        // Update vault total
        let vault = &mut ctx.accounts.vault;
        vault.total_locked = vault.total_locked.checked_sub(lock_record.amount)
            .ok_or(ErrorCode::Underflow)?;

        emit!(TokensUnlocked {
            user: ctx.accounts.user.key(),
            amount: lock_record.amount,
            vault: ctx.accounts.vault.key(),
        });

        Ok(())
    }

    /// Get lock information for detection
    pub fn get_lock_info(ctx: Context<GetLockInfo>) -> Result<LockInfo> {
        let lock_record = &ctx.accounts.lock_record;
        let current_time = Clock::get()?.unix_timestamp;
        
        Ok(LockInfo {
            owner: lock_record.owner,
            amount: lock_record.amount,
            unlock_timestamp: lock_record.unlock_timestamp,
            locked_at: lock_record.locked_at,
            is_unlocked: lock_record.is_unlocked,
            time_remaining: if lock_record.unlock_timestamp > current_time {
                (lock_record.unlock_timestamp - current_time) as u64
            } else {
                0
            },
            can_unlock: !lock_record.is_unlocked && current_time >= lock_record.unlock_timestamp,
        })
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Vault::LEN,
        seeds = [b"vault", token_mint.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    
    /// CHECK: Token mint for the vault
    pub token_mint: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct LockTokens<'info> {
    #[account(
        mut,
        seeds = [b"vault", vault.token_mint.as_ref()],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,
    
    #[account(
        init,
        payer = user,
        space = 8 + LockRecord::LEN,
        seeds = [b"lock", vault.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub lock_record: Account<'info, LockRecord>,
    
    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
        constraint = user_token_account.mint == vault.token_mint
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = vault_token_account.owner == vault.key(),
        constraint = vault_token_account.mint == vault.token_mint
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UnlockTokens<'info> {
    #[account(
        mut,
        seeds = [b"vault", vault.token_mint.as_ref()],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,
    
    #[account(
        mut,
        seeds = [b"lock", vault.key().as_ref(), user.key().as_ref()],
        bump,
        constraint = lock_record.owner == user.key()
    )]
    pub lock_record: Account<'info, LockRecord>,
    
    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
        constraint = user_token_account.mint == vault.token_mint
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = vault_token_account.owner == vault.key(),
        constraint = vault_token_account.mint == vault.token_mint
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct GetLockInfo<'info> {
    pub lock_record: Account<'info, LockRecord>,
}

#[account]
pub struct Vault {
    pub authority: Pubkey,
    pub token_mint: Pubkey,
    pub bump: u8,
    pub total_locked: u64,
}

impl Vault {
    pub const LEN: usize = 32 + 32 + 1 + 8;
}

#[account]
pub struct LockRecord {
    pub owner: Pubkey,
    pub amount: u64,
    pub unlock_timestamp: i64,
    pub locked_at: i64,
    pub vault: Pubkey,
    pub is_unlocked: bool,
}

impl LockRecord {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 32 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct LockInfo {
    pub owner: Pubkey,
    pub amount: u64,
    pub unlock_timestamp: i64,
    pub locked_at: i64,
    pub is_unlocked: bool,
    pub time_remaining: u64,
    pub can_unlock: bool,
}

#[event]
pub struct TokensLocked {
    pub user: Pubkey,
    pub amount: u64,
    pub unlock_timestamp: i64,
    pub vault: Pubkey,
}

#[event]
pub struct TokensUnlocked {
    pub user: Pubkey,
    pub amount: u64,
    pub vault: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid unlock time - must be in the future")]
    InvalidUnlockTime,
    #[msg("Invalid amount - must be greater than 0")]
    InvalidAmount,
    #[msg("Lock period has not expired yet")]
    LockPeriodNotExpired,
    #[msg("Tokens have already been unlocked")]
    AlreadyUnlocked,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Arithmetic underflow")]
    Underflow,
}