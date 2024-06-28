use anchor_lang::prelude::*;
use anchor_spl::{
    token::mint_to,
    token::{Mint, Token, TokenAccount},
    associated_token::AssociatedToken,
    token::MintTo
};
use solana_gateway::Gateway;

declare_id!("air4tyw7S12bvdRtgoLgyQXuBfoLrjBS7Fg4r91zLb1");

pub const TICKET: &[u8] = b"ticket";
pub const MINT_AUTHORITY: &[u8] = b"mint_authority";

#[program]
pub mod gated_airdrop {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, mint: Pubkey, gatekeeper_network: Pubkey, amount: u64) -> Result<()> {
        ctx.accounts.airdrop.mint = mint;
        ctx.accounts.airdrop.gatekeeper_network = gatekeeper_network;
        ctx.accounts.airdrop.amount = amount;
        Ok(())
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        // check the pass
        let gateway_token = ctx.accounts.gateway_token.to_account_info();
        Gateway::verify_gateway_token_account_info(
                &gateway_token,
                &ctx.accounts.recipient.key,
                &ctx.accounts.airdrop.gatekeeper_network,
                None
            ).map_err(|_e| {
                msg!("Gateway token account verification failed");
                ProgramError::InvalidArgument
        })?;

        msg!("Gateway token verification passed");

        // mint the tokens
        let airdrop = ctx.accounts.airdrop.key();
        let seeds = &[
            airdrop.as_ref(),
            MINT_AUTHORITY,
            &[ctx.bumps.mint_authority],
        ];
        let signer = &[&seeds[..]];
        mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    authority: ctx.accounts.mint_authority.to_account_info(),
                    to: ctx.accounts.recipient_token_account.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                },
            ).with_signer(signer),
            ctx.accounts.airdrop.amount,
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = Airdrop::SIZE,
    )]
    pub airdrop: Account<'info, Airdrop>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(
        has_one = mint
    )]
    pub airdrop: Account<'info, Airdrop>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        seeds = [airdrop.key().as_ref(), MINT_AUTHORITY],
        bump,
    )]
    pub mint_authority: SystemAccount<'info>,

    #[account(
        init,
        payer = payer,
        seeds = [airdrop.key().as_ref(), recipient.key().as_ref(), TICKET],
        bump,
        space = Ticket::SIZE,
    )]
    pub ticket: Account<'info, Ticket>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(
    init,
    payer = payer,
    associated_token::mint = mint,
    associated_token::authority = recipient,
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,

    /// CHECK: Verified by the solana-gateway program
    pub gateway_token: UncheckedAccount<'info>,

    pub recipient: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[account]
#[derive(Default)]
pub struct Airdrop {
    pub authority: Pubkey,
    pub gatekeeper_network: Pubkey,
    pub mint: Pubkey,
    pub amount: u64,
}
impl Airdrop {
    pub const SIZE: usize = 8 + 32 + 32 + 32 + 8;
}

#[account]
pub struct Ticket {
}
impl Ticket {
    pub const SIZE: usize = 8;
}