import * as anchor from "@coral-xyz/anchor";
import {Keypair, PublicKey, SystemProgram} from "@solana/web3.js";
import {
    createInitializeMint2Instruction,
    getMinimumBalanceForRentExemptMint,
    MINT_SIZE,
    TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import {BN} from "@coral-xyz/anchor";
import { GatedAirdrop } from "../vite/src/types/gated_airdrop";

// Create a new airdrop:
// export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
// export ANCHOR_WALLET=~/.config/solana/id.json

// Choose the Civic Pass to use to gate the airdrop
export const UNIQUENESS_PASS = new PublicKey("uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv")
export const LIVENESS_PASS = new PublicKey("vaa1QRNEBb1G2XjPohqGWnPsvxWnwwXF67pdjrhDSwM")
const CHOSEN_PASS = UNIQUENESS_PASS;

// each airdrop is for 1 token
const AMOUNT = 1;

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.GatedAirdrop as anchor.Program<GatedAirdrop>;

const newMint = Keypair.generate();
const newAirdrop = Keypair.generate();

const mintAuthority = PublicKey.findProgramAddressSync([
    newAirdrop.publicKey.toBuffer(),
    Buffer.from("mint_authority")
], program.programId)[0];

// create new mint
const lamports = await getMinimumBalanceForRentExemptMint(provider.connection);
const mintIxes = [
    SystemProgram.createAccount({
        fromPubkey: provider.publicKey,
        newAccountPubkey: newMint.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMint2Instruction(
        newMint.publicKey,
        0,
        mintAuthority,
        null
    )
];

// create the airdrop instance
await program.methods.initialize(
    newMint.publicKey,
    CHOSEN_PASS,
    new BN(AMOUNT)
).accounts({
    airdrop: newAirdrop.publicKey,
    authority: provider.publicKey,
}).preInstructions(mintIxes)
    .signers([newAirdrop, newMint])
    .rpc();


console.log("Airdrop created at:", newAirdrop.publicKey.toString());