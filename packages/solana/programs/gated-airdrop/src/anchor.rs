use std::ops::Deref;
use anchor_lang::Owner;
use anchor_lang::prelude::{msg, ProgramError, Pubkey};
use solana_gateway::Gateway;
use solana_gateway::program_borsh::try_from_slice_incomplete;

#[derive(Clone, Debug, Default, PartialEq)]
pub struct Pass(solana_gateway::state::GatewayToken);

impl Pass {
    pub const LEN: usize = solana_gateway::state::GatewayToken::SIZE;

    pub fn pass_type(&self) -> Pubkey {
        self.0.gatekeeper_network
    }

    pub fn valid(&self, recipient: &Pubkey, pass_type: &Pubkey) -> bool {
        Gateway::verify_gateway_token(
            &self.0,
            &recipient,
            &pass_type,
            None
        ).map_err(|_e| {
            msg!("Pass verification failed");
            ProgramError::InvalidArgument
        }).is_ok()
    }
}

impl anchor_lang::AccountDeserialize for Pass {
    fn try_deserialize_unchecked(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        try_from_slice_incomplete(buf)
            .map(Pass)
            .map_err(Into::into)
    }
}

impl anchor_lang::AccountSerialize for Pass {}

impl Owner for Pass {
    fn owner() -> Pubkey {
        Gateway::program_id()
    }
}

impl Deref for Pass {
    type Target = solana_gateway::state::GatewayToken;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl anchor_lang::IdlBuild for Pass {}

impl anchor_lang::Discriminator for Pass {
    const DISCRIMINATOR: [u8; 8] = [0; 8];
}
